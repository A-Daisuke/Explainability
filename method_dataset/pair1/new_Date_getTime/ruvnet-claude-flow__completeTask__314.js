function __method_wrapper__() {
  override async completeTask(taskId: string, result: unknown): Promise<void> {
    const task = await this.getTask(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // Calculate duration
    const duration = task.startedAt ? new Date().getTime() - task.startedAt.getTime() : 0;

    // Update task stats
    this.updateTaskStats(task.type, true, duration);

    // Update work stealing metrics
    if (task.assignedAgent) {
      this.workStealing.recordTaskDuration(task.assignedAgent, duration);
    }

    // Mark as completed in dependency graph
    const readyTasks = this.dependencyGraph.markCompleted(taskId);

    // Complete the task
    await super.completeTask(taskId, result);

    // Start ready tasks
    for (const readyTaskId of readyTasks) {
      const readyTask = await this.getTask(readyTaskId);
      if (readyTask) {
        this.eventBus.emit(SystemEvents.TASK_CREATED, { task: readyTask });
      }
    }
  }

}
