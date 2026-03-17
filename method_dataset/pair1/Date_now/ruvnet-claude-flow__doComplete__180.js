function __method_wrapper__() {
  protected async doComplete(request: LLMRequest): Promise<LLMResponse> {
    // Use chat endpoint for multi-turn conversations
    const ollamaRequest: OllamaChatRequest = {
      model: this.mapToOllamaModel(request.model || this.config.model),
      messages: request.messages.map(msg => ({
        role: msg.role === 'system' ? 'system' : msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      stream: false,
      options: {
        temperature: request.temperature ?? this.config.temperature,
        top_k: request.topK ?? this.config.topK,
        top_p: request.topP ?? this.config.topP,
        num_predict: request.maxTokens ?? this.config.maxTokens,
        stop: request.stopSequences ?? this.config.stopSequences,
      },
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout || 120000); // Longer timeout for local models

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ollamaRequest),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data: OllamaResponse = await response.json();
      
      // Calculate metrics
      const promptTokens = data.prompt_eval_count || this.estimateTokens(JSON.stringify(request.messages));
      const completionTokens = data.eval_count || this.estimateTokens(data.message?.content || '');
      const totalDuration = data.total_duration ? data.total_duration / 1000000 : 0; // Convert nanoseconds to milliseconds

      return {
        id: `ollama-${Date.now()}`,
        model: request.model || this.config.model,
        provider: 'ollama',
        content: data.message?.content || '',
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        cost: {
          promptCost: 0,
          completionCost: 0,
          totalCost: 0,
          currency: 'USD',
        },
        latency: totalDuration,
        finishReason: data.done ? 'stop' : 'length',
        metadata: {
          loadDuration: data.load_duration,
          promptEvalDuration: data.prompt_eval_duration,
          evalDuration: data.eval_duration,
        },
      };
    } catch (error) {
      clearTimeout(timeout);
      
      // Check if Ollama is running
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ProviderUnavailableError('ollama', {
          message: 'Cannot connect to Ollama. Make sure Ollama is running on ' + this.baseUrl,
        });
      }
      
      throw this.transformError(error);
    }
  }

}
