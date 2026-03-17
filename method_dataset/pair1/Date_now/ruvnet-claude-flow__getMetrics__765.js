function __method_wrapper__() {
  async getMetrics(): Promise<OrchestratorMetrics> {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const avgTaskDuration =
      this.metrics.completedTasks > 0
        ? this.metrics.totalTaskDuration / this.metrics.completedTasks
        : 0;

    return {
      uptime: Date.now() - this.startTime,
      totalAgents: this.agents.size,
      activeAgents: this.sessionManager.getActiveSessions().length,
      totalTasks: this.taskHistory.size,
      completedTasks: this.metrics.completedTasks,
      failedTasks: this.metrics.failedTasks,
      queuedTasks: this.taskQueue.length,
      avgTaskDuration,
      memoryUsage: memUsage,
      cpuUsage: cpuUsage,
      timestamp: new Date(),
    };
  }

}
