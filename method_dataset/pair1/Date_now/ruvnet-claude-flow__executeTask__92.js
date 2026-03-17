function __method_wrapper__() {
  async executeTask(
    task: TaskDefinition,
    agent: AgentState
  ): Promise<ExecutionResult> {
    const executionId = generateId('exec');
    const startTime = Date.now();

    this.logger.info(`Executing task ${task.id} with agent ${agent.id}`, {
      taskType: task.type,
      agentType: agent.type
    });

    try {
      // Emit start event
      this.emit('task:start', {
        executionId,
        taskId: task.id,
        agentId: agent.id
      });

      // Build the prompt for Claude
      const prompt = this.buildPrompt(task, agent);

      // Make request using SDK (retry is automatic)
      const response = await this.claudeClient.makeRequest({
        model: 'claude-3-sonnet-20240229',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        system: this.getSystemPrompt(agent),
        max_tokens: 4000,
        temperature: 0.7
      });

      // Extract and process the response
      const output = this.processResponse(response);

      // Calculate execution metrics
      const executionTime = Date.now() - startTime;
      const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

      // Store execution stats
      this.executionStats.set(executionId, {
        taskId: task.id,
        agentId: agent.id,
        executionTime,
        tokensUsed,
        timestamp: Date.now()
      });

      // Emit success event
      this.emit('task:complete', {
        executionId,
        taskId: task.id,
        agentId: agent.id,
        result: output
      });

      return {
        success: true,
        output,
        errors: [],
        executionTime,
        tokensUsed,
        retryCount: 0 // SDK handles retry internally
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;

      this.logger.error(`Task execution failed for ${task.id}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        taskId: task.id,
        agentId: agent.id
      });

      // Emit failure event
      this.emit('task:error', {
        executionId,
        taskId: task.id,
        agentId: agent.id,
        error
      });

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
