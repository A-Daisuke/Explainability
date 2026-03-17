function __method_wrapper__() {
  protected async doComplete(request: LLMRequest): Promise<LLMResponse> {
    const googleRequest = this.buildGoogleRequest(request);
    const model = this.mapToGoogleModel(request.model || this.config.model);
    
    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.config.apiKey}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout || 60000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleRequest),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data: GoogleAIResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new LLMProviderError(
          'No response generated',
          'NO_RESPONSE',
          'google',
          undefined,
          false
        );
      }

      const candidate = data.candidates[0];
      const content = candidate.content.parts.map(part => part.text).join('');
      
      // Calculate cost
      const usageData = data.usageMetadata || {
        promptTokenCount: this.estimateTokens(JSON.stringify(request.messages)),
        candidatesTokenCount: this.estimateTokens(content),
        totalTokenCount: 0,
      };
      usageData.totalTokenCount = usageData.promptTokenCount + usageData.candidatesTokenCount;

      const pricing = this.capabilities.pricing![request.model || this.config.model];
      const promptCost = (usageData.promptTokenCount / 1000) * pricing.promptCostPer1k;
      const completionCost = (usageData.candidatesTokenCount / 1000) * pricing.completionCostPer1k;

      return {
        id: `google-${Date.now()}`,
        model: request.model || this.config.model,
        provider: 'google',
        content,
        usage: {
          promptTokens: usageData.promptTokenCount,
          completionTokens: usageData.candidatesTokenCount,
          totalTokens: usageData.totalTokenCount,
        },
        cost: {
          promptCost,
          completionCost,
          totalCost: promptCost + completionCost,
          currency: 'USD',
        },
        finishReason: this.mapFinishReason(candidate.finishReason),
      };
    } catch (error) {
      clearTimeout(timeout);
      throw this.transformError(error);
    }
  }

}
