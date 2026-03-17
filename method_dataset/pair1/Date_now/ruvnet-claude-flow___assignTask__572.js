function __method_wrapper__() {
  async _assignTask(workerId, taskId) {
    const worker = this.state.workers.get(workerId);
    const task = this.state.tasks.get(taskId);

    if (!worker || !task) return;

    worker.status = 'busy';
    worker.currentTask = taskId;
    task.status = 'in_progress';
    task.assignedTo = workerId;

    // Store assignment in memory
    await this.mcpWrapper.storeMemory(
      this.state.swarmId,
      `assignment-${taskId}`,
      { workerId, taskId, timestamp: Date.now() },
      'task',
    );

    this.emit('task:assigned', { workerId, taskId });

    // Simulate task execution
    this._executeTask(workerId, taskId);
  }

}
