function __method_wrapper__() {
  async executeTask(
    task: TaskDefinition,
    agent: AgentState,
    targetDir?: string,
  ): Promise<TaskResult> {
    this.logger.info('Executing task with Claude Flow SPARC', {
      taskId: task.id.id,
      taskName: task.name,
      agentType: agent.type,
      targetDir,
    });

    const startTime = Date.now();

    try {
      // Determine the SPARC mode based on task type and agent type
      const sparcMode = this.determineSparcMode(task, agent);

      // Build the command
      const command = this.buildSparcCommand(task, sparcMode, targetDir);

      this.logger.info('Executing SPARC command', {
        mode: sparcMode,
        command: command.join(' '),
      });

      // Execute the command
      const result = await this.executeCommand(command);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      return {
        output: result.output,
        artifacts: result.artifacts || {},
        metadata: {
          executionTime,
          sparcMode,
          command: command.join(' '),
          exitCode: result.exitCode,
          quality: 0.95,
          completeness: 0.9,
        },
        error: result.error,
      };
    } catch (error) {
      this.logger.error('Failed to execute Claude Flow SPARC command', {
        error: error instanceof Error ? error.message : String(error),
        taskId: task.id.id,
      });

      return {
        output: '',
        artifacts: {},
        metadata: {
          executionTime: Date.now() - startTime,
          quality: 0,
          completeness: 0,
        },
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

}
