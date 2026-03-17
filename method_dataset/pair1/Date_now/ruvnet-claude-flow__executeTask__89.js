function __method_wrapper__() {
  async executeTask(
    task: TaskDefinition,
    agent: AgentState,
    targetDir?: string,
  ): Promise<TaskResult> {
    this.logger.info('Executing SPARC-enhanced task', {
      taskId: task.id.id,
      taskName: task.name,
      agentType: agent.type,
      targetDir,
    });

    const startTime = Date.now();

    try {
      // Ensure target directory exists
      if (targetDir) {
        await fs.mkdir(targetDir, { recursive: true });
      }

      // Determine which SPARC phase to execute based on task and agent
      const result = await this.executeSparcPhase(task, agent, targetDir);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      return {
        output: result,
        artifacts: result.artifacts || {},
        metadata: {
          agentId: agent.id.id,
          agentType: agent.type,
          executionTime,
          targetDir,
          sparcPhase: result.phase,
          quality: result.quality || 1.0,
        },
        quality: result.quality || 1.0,
        completeness: result.completeness || 1.0,
        accuracy: 1.0,
        executionTime,
        resourcesUsed: {
          cpuTime: executionTime,
          maxMemory: 0,
          diskIO: 0,
          networkIO: 0,
          fileHandles: 0,
        },
        validated: true,
      };
    } catch (error) {
      this.logger.error('SPARC task execution failed', {
        taskId: task.id.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

}
