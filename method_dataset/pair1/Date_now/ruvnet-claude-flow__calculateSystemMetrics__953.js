function calculateSystemMetrics() {
  return {
    timestamp: Date.now(),
    performance: {
      requestsPerSecond: 125.7,
      averageResponseTime: 89.3,
      throughput: 1024 * 1024 * 2.5, // 2.5 MB/s
      errorRate: 0.12,
    },
    resources: {
      memoryUsage: 68.2,
      cpuUsage: 24.1,
      activeConnections: 145,
      diskUsage: 45.8,
      networkIO: {
        bytesIn: 1024 * 1024 * 16.2,
        bytesOut: 1024 * 1024 * 29.1,
        packetsIn: 12890,
        packetsOut: 10234,
      },
    },
    connections: {
      activeWebSockets: 67,
      totalConnections: 145,
      connectionRate: 12.3,
      subscriptionCount: 89,
    },
  };
}
