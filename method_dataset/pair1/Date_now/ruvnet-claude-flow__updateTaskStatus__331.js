class __C__ {
  updateTaskStatus(taskId: string, status: HiveTask['status'], result?: any) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.status = status;
    if (result) task.result = result;
    if (status === 'completed' && task.metrics) {
      task.metrics.endTime = Date.now();
    }

    this.emit('task:updated', task);

    // Check if we can start dependent tasks
    if (status === 'completed') {
      this.checkDependentTasks(taskId);
    }
  }

}
