function __method_wrapper__() {
  async executeTool(name: string, input: unknown, context?: any): Promise<unknown> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new MCPError(`Tool not found: ${name}`);
    }

    const startTime = Date.now();
    const metrics = this.metrics.get(name);

    this.logger.debug('Executing tool', { name, input });

    try {
      // Validate input against schema
      this.validateInput(tool, input);

      // Check tool capabilities and permissions
      await this.checkToolCapabilities(name, context);

      // Execute tool handler
      const result = await tool.handler(input, context);

      // Update success metrics
      if (metrics) {
        const executionTime = Date.now() - startTime;
        metrics.totalInvocations++;
        metrics.successfulInvocations++;
        metrics.totalExecutionTime += executionTime;
        metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.totalInvocations;
        metrics.lastInvoked = new Date();
      }

      this.logger.debug('Tool executed successfully', {
        name,
        executionTime: Date.now() - startTime,
      });
      this.emit('toolExecuted', { name, success: true, executionTime: Date.now() - startTime });

      return result;
    } catch (error) {
      // Update failure metrics
      if (metrics) {
        const executionTime = Date.now() - startTime;
        metrics.totalInvocations++;
        metrics.failedInvocations++;
        metrics.totalExecutionTime += executionTime;
        metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.totalInvocations;
        metrics.lastInvoked = new Date();
      }

      this.logger.error('Tool execution failed', {
        name,
        error,
        executionTime: Date.now() - startTime,
      });
      this.emit('toolExecuted', {
        name,
        success: false,
        error,
        executionTime: Date.now() - startTime,
      });
      throw error;
    }
  }

}
