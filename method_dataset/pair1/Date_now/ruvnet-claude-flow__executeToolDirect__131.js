class __C__ {
  async executeToolDirect(execution) {
    this.currentExecutions++;
    execution.status = 'running';
    execution.startTime = Date.now();

    try {
      this.ui.addLog('info', `Executing ${execution.toolName}...`);

      // Execute via MCP layer
      const result = await this.mcpLayer.executeTool(
        execution.toolName,
        execution.parameters,
        execution.options,
      );

      // Format result
      const formattedResult = this.formatResult(execution.toolName, result.result);

      // Update execution
      execution.status = 'completed';
      execution.endTime = Date.now();
      execution.duration = execution.endTime - execution.startTime;
      execution.result = formattedResult;

      // Log success
      this.ui.addLog('success', `${execution.toolName} completed in ${execution.duration}ms`);

      // Process queue
      this.processQueue();

      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = Date.now();
      execution.error = error.message;

      this.ui.addLog('error', `${execution.toolName} failed: ${error.message}`);

      // Process queue
      this.processQueue();

      throw error;
    } finally {
      this.currentExecutions--;
    }
  }

}
