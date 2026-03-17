function __method_wrapper__() {
  async assignTask(task: TaskDefinition): Promise<void> {
    if (this.status !== 'idle') {
      throw new Error(`Agent ${this.id} is not available (status: ${this.status})`);
    }

    if (this.currentTasks.length >= this.capabilities.maxConcurrentTasks) {
      throw new Error(`Agent ${this.id} has reached maximum concurrent tasks`);
    }

    this.logger.info('Task assigned to agent', {
      agentId: this.id,
      taskId: task.id,
      taskType: task.type,
    });

    this.currentTasks.push(task.id);
    this.status = 'busy';
    this.workload = this.currentTasks.length / this.capabilities.maxConcurrentTasks;

    this.emit('agent:task-assigned', { agentId: this.id, taskId: task.id });
    this.emit('agent:status-changed', { agentId: this.id, status: this.status });

    try {
      const startTime = Date.now();
      const result = await this.executeTask(task);
      const executionTime = Date.now() - startTime;

      // Update metrics
      this.updateTaskMetrics(task.id, executionTime, true);

      // Remove from current tasks
      this.currentTasks = this.currentTasks.filter((id) => id !== task.id);
      this.taskHistory.push(task.id);

      // Update status
      this.status = this.currentTasks.length > 0 ? 'busy' : 'idle';
      this.workload = this.currentTasks.length / this.capabilities.maxConcurrentTasks;

      this.emit('agent:task-completed', {
        agentId: this.id,
        taskId: task.id,
        result,
        executionTime,
      });

      this.logger.info('Task completed successfully', {
        agentId: this.id,
        taskId: task.id,
        executionTime,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Update metrics
      this.updateTaskMetrics(task.id, 0, false);

      // Add to error history
      this.addError({
        timestamp: new Date(),
        type: 'task_execution_failed',
        message: errorMessage,
        context: { taskId: task.id, taskType: task.type },
        severity: 'high',
        resolved: false,
      });

      // Remove from current tasks
      this.currentTasks = this.currentTasks.filter((id) => id !== task.id);
      this.status = this.currentTasks.length > 0 ? 'busy' : 'idle';
      this.workload = this.currentTasks.length / this.capabilities.maxConcurrentTasks;

      this.emit('agent:task-failed', {
        agentId: this.id,
        taskId: task.id,
        error: errorMessage,
      });

      this.logger.error('Task execution failed', {
        agentId: this.id,
        taskId: task.id,
        error: errorMessage,
      });

      throw error;
    }
  }

}
