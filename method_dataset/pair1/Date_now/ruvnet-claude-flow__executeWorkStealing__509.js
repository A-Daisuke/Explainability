function __method_wrapper__() {
  private async executeWorkStealing(
    sourceAgentId: string,
    targetAgentId: string,
    taskCount: number,
  ): Promise<void> {
    const operationId = `steal-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const operation: WorkStealingOperation = {
      id: operationId,
      sourceAgent: { id: sourceAgentId, swarmId: 'default', type: 'coordinator', instance: 1 },
      targetAgent: { id: targetAgentId, swarmId: 'default', type: 'coordinator', instance: 1 },
      tasks: [],
      reason: 'load_imbalance',
      status: 'planned',
      startTime: new Date(),
      metrics: {
        tasksStolen: 0,
        loadReduction: 0,
        latencyImprovement: 0,
      },
    };

    this.stealOperations.set(operationId, operation);

    try {
      operation.status = 'executing';

      // Get source queue
      const sourceQueue = this.taskQueues.get(sourceAgentId) || [];
      if (sourceQueue.length === 0) {
        throw new Error('Source agent has no tasks to steal');
      }

      // Select tasks to steal (lowest priority first)
      const tasksToSteal = sourceQueue
        .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === 'low' ? -1 : 1))
        .slice(0, Math.min(taskCount, this.config.maxStealBatch));

      // Remove tasks from source
      for (const task of tasksToSteal) {
        this.updateTaskQueue(sourceAgentId, task, 'remove');
        this.updateTaskQueue(targetAgentId, task, 'add');
        operation.tasks.push(task.id);
      }

      // Update metrics
      operation.metrics.tasksStolen = tasksToSteal.length;
      operation.metrics.loadReduction = this.calculateLoadReduction(
        sourceAgentId,
        tasksToSteal.length,
      );
      operation.status = 'completed';
      operation.endTime = new Date();

      this.logger.info('Work stealing completed', {
        operationId,
        sourceAgent: sourceAgentId,
        targetAgent: targetAgentId,
        tasksStolen: operation.metrics.tasksStolen,
      });

      this.emit('workstealing:completed', { operation });
    } catch (error) {
      operation.status = 'failed';
      operation.endTime = new Date();

      this.logger.error('Work stealing failed', {
        operationId,
        sourceAgent: sourceAgentId,
        targetAgent: targetAgentId,
        error,
      });

      this.emit('workstealing:failed', { operation, error });
    }
  }

}
