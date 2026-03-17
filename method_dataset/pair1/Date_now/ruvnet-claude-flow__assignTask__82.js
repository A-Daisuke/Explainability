function __method_wrapper__() {
  async assignTask(taskId: string, executionPlan: any): Promise<void> {
    if (this.currentTask) {
      throw new Error('Agent already has an active task');
    }

    this.currentTask = taskId;
    this.status = 'busy';

    // Update database
    await this.db.updateAgent(this.id, {
      status: 'busy',
      current_task_id: taskId,
    });

    // Store task in memory
    this.memory.set('current_task', { taskId, executionPlan, startTime: Date.now() });

    // Start task execution
    this.executeTask(taskId, executionPlan).catch((error) => {
      this.emit('taskError', { taskId, error });
    });

    this.emit('taskAssigned', { taskId });
  }

}
