function __method_wrapper__() {
  private async completeRunningTasks(): Promise<void> {
    const runningTasks = Array.from(this.tasks.values()).filter(
      (task) => task.status === 'running',
    );

    // Wait for tasks to complete or timeout
    const timeout = 30000; // 30 seconds
    const deadline = Date.now() + timeout;

    while (runningTasks.some((task) => task.status === 'running') && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Cancel any remaining running tasks
    for (const task of runningTasks) {
      if (task.status === 'running') {
        await this.cancelTask(task.id.id, 'Swarm shutdown');
      }
    }
  }

}
