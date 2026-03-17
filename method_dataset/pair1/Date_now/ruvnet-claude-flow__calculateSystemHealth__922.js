function calculateSystemHealth() {
  const now = Date.now();
  
  return {
    status: 'HEALTHY',
    timestamp: now,
    services: {
      api: { status: 'UP', responseTime: 45, lastCheck: now, errorCount: 0, uptime: 99.9 },
      websocket: { status: 'UP', responseTime: 12, lastCheck: now, errorCount: 0, uptime: 99.8 },
      graphql: { status: 'UP', responseTime: 78, lastCheck: now, errorCount: 0, uptime: 99.9 },
      database: { status: 'UP', responseTime: 125, lastCheck: now, errorCount: 0, uptime: 99.7 },
      cache: { status: 'UP', responseTime: 8, lastCheck: now, errorCount: 0, uptime: 99.9 },
    },
    metrics: {
      memoryUsage: 67.5,
      cpuUsage: 23.8,
      activeConnections: 142,
      diskUsage: 45.2,
      networkIO: {
        bytesIn: 1024 * 1024 * 15.7,
        bytesOut: 1024 * 1024 * 28.3,
        packetsIn: 12450,
        packetsOut: 9876,
      },
    },
    uptime: now - dataStore.metrics.startTime,
    responseTime: 89.5,
    errorRate: 0.15,
  };
}
