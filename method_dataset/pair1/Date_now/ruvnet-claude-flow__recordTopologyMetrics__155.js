function __method_wrapper__() {
  async recordTopologyMetrics(metrics: {
    type: string;
    agentCount: number;
    connectionCount: number;
    averageLatency: number;
    throughput: number;
    reliability: number;
    timestamp?: Date;
  }): Promise<void> {
    const timestampedMetrics = {
      ...metrics,
      timestamp: metrics.timestamp || new Date()
    };

    const key = `topology-${Date.now()}`;
    await this.database.store(key, timestampedMetrics, 'metrics');

    this.addToBuffer('topology', timestampedMetrics);
  }

}
