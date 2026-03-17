function __method_wrapper__() {
  taskCompleted(agentId: string, taskId: string, outputSize?: number): void {
    const metrics = this.agentMetrics.get(agentId);
    const startTime = this.taskStartTimes.get(taskId);

    if (metrics && startTime) {
      const duration = Date.now() - startTime;
      metrics.status = 'completed';
      metrics.endTime = Date.now();
      metrics.duration = duration;
      metrics.lastActivity = Date.now();
      metrics.successCount++;
      metrics.outputSize = outputSize;

      // Update average duration
      const totalDuration = metrics.averageTaskDuration * (metrics.successCount - 1) + duration;
      metrics.averageTaskDuration = totalDuration / metrics.successCount;

      // Update error rate
      metrics.errorRate = (metrics.failureCount / metrics.taskCount) * 100;

      // Track for throughput calculation
      this.taskCompletionTimes.push(Date.now());
      this.tasksInLastMinute++;

      this.taskStartTimes.delete(taskId);
      this.emit('task:completed', { agentId, taskId, duration, outputSize });
    }
  }

}
