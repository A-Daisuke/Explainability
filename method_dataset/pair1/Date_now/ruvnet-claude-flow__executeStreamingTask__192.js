function __method_wrapper__() {
  async executeStreamingTask(
    task: TaskDefinition,
    agent: AgentState,
    onChunk?: (chunk: string) => void
  ): Promise<ExecutionResult> {
    const executionId = generateId('stream-exec');
    const startTime = Date.now();

    this.logger.info(`Executing streaming task ${task.id}`, {
      taskType: task.type,
      agentId: agent.id
    });

    try {
      const prompt = this.buildPrompt(task, agent);
      let fullOutput = '';

      // Make streaming request
      const response = await this.claudeClient.makeStreamingRequest(
        {
          model: 'claude-3-sonnet-20240229',
          messages: [{ role: 'user', content: prompt }],
          system: this.getSystemPrompt(agent),
          max_tokens: 4000,
          temperature: 0.7,
          stream: true
        },
        (chunk) => {
          if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
            fullOutput += chunk.delta.text;
            onChunk?.(chunk.delta.text);
          }
        }
      );

      const executionTime = Date.now() - startTime;
      const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

      return {
        success: true,
        output: fullOutput,
        errors: [],
        executionTime,
        tokensUsed
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      return {
        success: false,
        output: null,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        executionTime,
        tokensUsed: 0
      };
    }
  }

}
