function __method_wrapper__() {
  taskFailed(agentId: string, taskId: string, error: string): void {
    const metrics = this.agentMetrics.get(agentId);
    const startTime = this.taskStartTimes.get(taskId);

    if (metrics) {
      const duration = startTime ? Date.now() - startTime : 0;
      metrics.status = 'failed';
      metrics.endTime = Date.now();
      metrics.duration = duration;
      metrics.lastActivity = Date.now();
      metrics.failureCount++;

      // Update error rate
      metrics.errorRate = (metrics.failureCount / metrics.taskCount) * 100;

      this.taskStartTimes.delete(taskId);
      this.emit('task:failed', { agentId, taskId, error, duration });

      // Check error rate threshold
      if (metrics.errorRate > this.config.errorRateThreshold) {
        this.createAlert(
          'error_rate',
          'critical',
          `Agent ${metrics.name} has high error rate: ${metrics.errorRate.toFixed(1)}%`,
        );
      }
    }
  }

}
