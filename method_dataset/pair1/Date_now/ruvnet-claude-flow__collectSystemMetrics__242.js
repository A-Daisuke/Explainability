function __method_wrapper__() {
  private async collectSystemMetrics(): Promise<SystemMetrics> {
    const startTime = Date.now();

    try {
      // Get system resource usage
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      // Get component-specific metrics
      const agentManager = this.systemIntegration.getComponent('agentManager');
      const taskEngine = this.systemIntegration.getComponent('taskEngine');

      let activeAgents = 0;
      let activeTasks = 0;
      let queuedTasks = 0;
      let completedTasks = 0;

      if (agentManager && typeof agentManager.getMetrics === 'function') {
        const agentMetrics = await agentManager.getMetrics();
        activeAgents = agentMetrics.activeAgents || 0;
      }

      if (taskEngine && typeof taskEngine.getMetrics === 'function') {
        const taskMetrics = await taskEngine.getMetrics();
        activeTasks = taskMetrics.activeTasks || 0;
        queuedTasks = taskMetrics.queuedTasks || 0;
        completedTasks = taskMetrics.completedTasks || 0;
      }

      return {
        cpu: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to percentage
        memory: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
        network: 0, // Placeholder - would need additional monitoring
        disk: 0, // Placeholder - would need additional monitoring
        activeAgents,
        activeTasks,
        queuedTasks,
        completedTasks,
        errorCount: this.getErrorCount(),
        uptime: process.uptime() * 1000,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error('Failed to collect system metrics:', getErrorMessage(error));
      return {
        cpu: 0,
        memory: 0,
        network: 0,
        disk: 0,
        activeAgents: 0,
        activeTasks: 0,
        queuedTasks: 0,
        completedTasks: 0,
        errorCount: 0,
        uptime: process.uptime() * 1000,
        timestamp: Date.now(),
      };
    }
  }

}
