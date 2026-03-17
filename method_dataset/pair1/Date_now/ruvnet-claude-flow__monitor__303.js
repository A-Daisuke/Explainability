function __method_wrapper__() {
  async monitor(): Promise<Metrics> {
    const agentMetrics: AgentMetrics[] = Array.from(this.agents.values()).map(agent => ({
      agentId: agent.id,
      type: agent.type,
      performance: agent.performance!,
      status: agent.status
    }));

    // Calculate system metrics
    const totalMemory = agentMetrics.reduce((sum, m) => sum + m.performance.resourceUtilization.memory, 0);
    const totalCpu = agentMetrics.reduce((sum, m) => sum + m.performance.resourceUtilization.cpu, 0);
    const activeConnections = Array.from(this.agents.values()).reduce((sum, agent) => sum + (agent.connections?.length || 0), 0);

    const systemMetrics = {
      uptime: Date.now() - (this.getOldestAgent()?.metadata.spawnedAt ? new Date(this.getOldestAgent()!.metadata.spawnedAt).getTime() : Date.now()),
      memoryUsage: totalMemory / agentMetrics.length || 0,
      cpuUsage: totalCpu / agentMetrics.length || 0,
      networkLatency: Math.random() * 10 + 5, // Simulated
      activeConnections
    };

    // Calculate performance metrics
    const totalTasks = agentMetrics.reduce((sum, m) => sum + m.performance.tasksCompleted, 0);
    const avgSuccessRate = agentMetrics.reduce((sum, m) => sum + m.performance.successRate, 0) / agentMetrics.length || 0;
    const avgResponseTime = agentMetrics.reduce((sum, m) => sum + m.performance.averageResponseTime, 0) / agentMetrics.length || 0;

    const performanceMetrics = {
      throughput: totalTasks / (systemMetrics.uptime / 1000 / 60) || 0, // tasks per minute
      latency: avgResponseTime,
      errorRate: 1 - avgSuccessRate,
      bottlenecks: this.identifyBottlenecks(agentMetrics)
    };

    return {
      agents: agentMetrics,
      system: systemMetrics,
      performance: performanceMetrics
    };
  }

}
