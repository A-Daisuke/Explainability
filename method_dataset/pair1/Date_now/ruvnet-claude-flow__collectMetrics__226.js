function __method_wrapper__() {
  private async collectMetrics(): Promise<void> {
    try {
      // Collect system metrics
      const cpuUsage = this.getCPUUsage();
      const memInfo = this.getMemoryInfo();
      const loadAvg = os.loadavg();

      // Calculate throughput
      const now = Date.now();
      const minuteAgo = now - 60000;
      this.taskCompletionTimes = this.taskCompletionTimes.filter((time) => time > minuteAgo);
      const throughput = this.taskCompletionTimes.length;

      // Calculate task statistics
      let totalTasks = 0;
      let completedTasks = 0;
      let failedTasks = 0;
      let activeAgents = 0;
      let totalDuration = 0;
      let durationCount = 0;

      // Check for stalled agents
      for (const [agentId, metrics] of this.agentMetrics) {
        if (metrics.status === 'running') {
          activeAgents++;

          // Check for stalled agent
          const stallTime = now - metrics.lastActivity;
          if (stallTime > this.config.stallTimeout) {
            metrics.status = 'stalled';
            this.createAlert(
              'stalled_agent',
              'warning',
              `Agent ${metrics.name} appears to be stalled (${Math.round(stallTime / 1000)}s inactive)`,
            );
          }
        }

        totalTasks += metrics.taskCount;
        completedTasks += metrics.successCount;
        failedTasks += metrics.failureCount;

        if (metrics.averageTaskDuration > 0) {
          totalDuration += metrics.averageTaskDuration * metrics.successCount;
          durationCount += metrics.successCount;
        }
      }

      const avgDuration = durationCount > 0 ? totalDuration / durationCount : 0;
      const pendingTasks = totalTasks - completedTasks - failedTasks;

      // Create system metrics
      const systemMetrics: SystemMetrics = {
        timestamp: now,
        cpuUsage,
        memoryUsage: memInfo.usagePercent,
        totalMemory: memInfo.total,
        freeMemory: memInfo.free,
        loadAverage: loadAvg,
        activeAgents,
        totalTasks,
        completedTasks,
        failedTasks,
        pendingTasks,
        averageTaskDuration: avgDuration,
        throughput,
      };

      this.systemMetrics.push(systemMetrics);

      // Check system thresholds
      if (this.config.enableAlerts) {
        this.checkThresholds(systemMetrics);
      }

      // Clean old metrics
      this.cleanOldMetrics();

      // Save history if enabled
      if (this.config.enableHistory) {
        await this.saveHistory(systemMetrics);
      }

      // Emit metrics update
      this.emit('metrics:updated', {
        system: systemMetrics,
        agents: Array.from(this.agentMetrics.values()),
      });
    } catch (error) {
      this.logger.error('Error collecting metrics:', error);
    }
  }

}
