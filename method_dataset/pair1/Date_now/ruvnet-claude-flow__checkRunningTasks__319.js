function __method_wrapper__() {
  private checkRunningTasks(): void {
    // Check for hung or timed out tasks
    const now = Date.now();

    for (const [taskId, task] of this.tasks) {
      if (task.status !== 'running' || !task.startTime) continue;

      const runtime = now - task.startTime.getTime();
      const timeout = task.options?.timeout || this.config.defaultTimeout;

      if (runtime > timeout) {
        const process = this.processes.get(taskId);
        if (process) {
          this.logger.warn(`Killing timed out task ${taskId}`);
          process.kill('SIGTERM');

          // Force kill after 5 seconds
          setTimeout(() => {
            if (this.processes.has(taskId)) {
              process.kill('SIGKILL');
            }
          }, 5000);
        }
      }
    }
  }

}
