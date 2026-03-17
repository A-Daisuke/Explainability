function __method_wrapper__() {
  async recordAgentMetrics(agentId: string, metrics: {
    tasksCompleted: number;
    successRate: number;
    averageResponseTime: number;
    resourceUtilization: any;
    timestamp?: Date;
  }): Promise<void> {
    const timestampedMetrics = {
      agentId,
      ...metrics,
      timestamp: metrics.timestamp || new Date()
    };

    const key = `agent-${agentId}-${Date.now()}`;
    await this.database.store(key, timestampedMetrics, 'metrics');

    this.addToBuffer('agents', timestampedMetrics);
  }

}
