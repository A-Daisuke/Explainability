function __method_wrapper__() {
  async execute(options: AgentExecutionOptions): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    const taskId = options.memoryTaskId || `task-${Date.now()}`;

    try {
      // Initialize memory if requested
      if (options.enableMemory && !this.memoryEnabled) {
        try {
          await this.initializeMemory(options.memoryDatabase);
        } catch (error) {
          console.warn('Memory initialization failed, continuing without memory');
        }
      }

      // Trigger pre-execution hook
      if (this.hooksManager) {
        await this.hooksManager.trigger('pre-agent-execute', {
          agent: options.agent,
          task: options.task,
          provider: options.provider || 'anthropic',
          timestamp: Date.now(),
          memoryEnabled: this.memoryEnabled || options.enableMemory,
        });
      }

      // Build agentic-flow command
      const command = this.buildCommand(options);

      // Execute command
      const { stdout, stderr } = await execAsync(command, {
        timeout: options.timeout || 300000, // 5 minutes default
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer,
      });

      const duration = Date.now() - startTime;

      // Parse output
      const result: AgentExecutionResult = {
        success: true,
        output: stdout,
        provider: options.provider || 'anthropic',
        model: options.model || 'default',
        duration,
        agent: options.agent,
        task: options.task,
        memoryEnabled: this.memoryEnabled || options.enableMemory || false,
      };

      // Trigger post-execution hook
      if (this.hooksManager) {
        await this.hooksManager.trigger('post-agent-execute', {
          agent: options.agent,
          task: options.task,
          result,
          success: true,
        });
      }

      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;

      const result: AgentExecutionResult = {
        success: false,
        output: '',
        error: error.message,
        provider: options.provider || 'anthropic',
        model: options.model || 'default',
        duration,
        agent: options.agent,
        task: options.task,
        memoryEnabled: this.memoryEnabled || options.enableMemory || false,
      };

      // Trigger error hook
      if (this.hooksManager) {
        await this.hooksManager.trigger('agent-execute-error', {
          agent: options.agent,
          task: options.task,
          error: error.message,
        });
      }

      return result;
    }
  }

}
