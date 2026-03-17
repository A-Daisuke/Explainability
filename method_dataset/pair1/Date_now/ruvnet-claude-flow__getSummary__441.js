function __method_wrapper__() {
  getSummary(): {
    uptime: number;
    totalAgents: number;
    activeAgents: number;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    successRate: number;
    averageDuration: number;
    currentThroughput: number;
    alerts: number;
  } {
    const current = this.getSystemMetrics();
    const uptime = Date.now() - this.startTime;
    const totalAgents = this.agentMetrics.size;
    const activeAgents = current?.activeAgents || 0;
    const totalTasks = current?.totalTasks || 0;
    const completedTasks = current?.completedTasks || 0;
    const failedTasks = current?.failedTasks || 0;
    const successRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const averageDuration = current?.averageTaskDuration || 0;
    const currentThroughput = current?.throughput || 0;
    const alerts = this.alerts.filter((a) => a.timestamp > Date.now() - 3600000).length; // Last hour

    return {
      uptime,
      totalAgents,
      activeAgents,
      totalTasks,
      completedTasks,
      failedTasks,
      successRate,
      averageDuration,
      currentThroughput,
      alerts,
    };
  }

}
