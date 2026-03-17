function __method_wrapper__() {
  async getPerformanceMetrics(timeRange?: { start: Date; end: Date }): Promise<PerformanceMetrics> {
    const range = timeRange || {
      start: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      end: new Date(),
    };

    const systemMetrics = await this.queryMetrics({
      metrics: ['cpu-usage', 'memory-usage', 'disk-usage', 'network-io'],
      timeRange: range,
      aggregation: 'avg',
    });

    const appMetrics = await this.queryMetrics({
      metrics: ['response-time', 'request-rate', 'error-rate', 'uptime'],
      timeRange: range,
      aggregation: 'avg',
    });

    const dbMetrics = await this.queryMetrics({
      metrics: ['db-connections', 'query-time', 'db-size'],
      timeRange: range,
      aggregation: 'avg',
    });

    // Construct performance metrics (simplified)
    return {
      system: {
        cpu: {
          usage: this.getLatestValue(systemMetrics['cpu-usage']) || 0,
          cores: 8, // Would be detected from system
          loadAverage: [1.2, 1.5, 1.8], // Would be collected from system
        },
        memory: {
          used: this.getLatestValue(systemMetrics['memory-usage']) || 0,
          free: 4000000000, // Would be calculated
          total: 8000000000,
          usage: 50,
        },
        disk: {
          used: this.getLatestValue(systemMetrics['disk-usage']) || 0,
          free: 100000000000,
          total: 500000000000,
          usage: 20,
          iops: 1000,
        },
        network: {
          bytesIn: 1000000,
          bytesOut: 2000000,
          packetsIn: 5000,
          packetsOut: 6000,
          errors: 5,
        },
      },
      application: {
        responseTime: {
          avg: this.getLatestValue(appMetrics['response-time']) || 0,
          p50: 150,
          p95: 500,
          p99: 1000,
        },
        throughput: {
          requestsPerSecond: this.getLatestValue(appMetrics['request-rate']) || 0,
          transactionsPerSecond: 50,
        },
        errors: {
          rate: this.getLatestValue(appMetrics['error-rate']) || 0,
          count: 10,
          types: { '500': 5, '404': 3, '400': 2 },
        },
        availability: {
          uptime: this.getLatestValue(appMetrics['uptime']) || 0,
          sla: 99.9,
          incidents: 2,
        },
      },
      database: {
        connections: {
          active: 25,
          idle: 75,
          max: 100,
        },
        queries: {
          avgExecutionTime: this.getLatestValue(dbMetrics['query-time']) || 0,
          slowQueries: 5,
          deadlocks: 0,
        },
        storage: {
          size: this.getLatestValue(dbMetrics['db-size']) || 0,
          growth: 1000000, // bytes per day
          fragmentation: 5,
        },
      },
      infrastructure: {
        containers: {
          running: 12,
          stopped: 2,
          restarts: 3,
        },
        services: {
          healthy: 15,
          unhealthy: 1,
          degraded: 0,
        },
      },
    };
  }

}
