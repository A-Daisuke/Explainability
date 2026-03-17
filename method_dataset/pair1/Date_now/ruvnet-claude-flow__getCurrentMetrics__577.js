function getCurrentMetrics() {
  const avgResponseTime =
    performanceMetrics.responseTime.length > 0
      ? performanceMetrics.responseTime.reduce((a, b) => a + b, 0) /
        performanceMetrics.responseTime.length
      : 0;

  const throughput =
    performanceMetrics.requestCount / ((Date.now() - performanceMetrics.startTime) / 1000);
  const errorRate =
    performanceMetrics.requestCount > 0
      ? (performanceMetrics.errorCount / performanceMetrics.requestCount) * 100
      : 0;

  const uptime = Date.now() - performanceMetrics.startTime;
  const tokenUsage = calculateTokenUsage();
  const health = performHealthCheck();
  const load = monitorLoad();

  return {
    performance: {
      responseTime: Math.round(avgResponseTime),
      throughput: Math.round(throughput),
      errorRate: Math.round(errorRate * 100) / 100,
      uptime: formatUptime(uptime),
    },
    tokens: tokenUsage,
    health,
    load,
  };
}
