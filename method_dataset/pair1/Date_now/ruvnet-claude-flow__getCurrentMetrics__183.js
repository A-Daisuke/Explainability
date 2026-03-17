function __method_wrapper__() {
  getCurrentMetrics(): PerformanceMetrics {
    const now = Date.now();
    const completedRequests = Array.from(this.requestMetrics.values()).filter(
      (m) => m.endTime !== undefined,
    );

    const successfulRequests = completedRequests.filter((m) => m.success);
    const errorRate =
      completedRequests.length > 0
        ? ((completedRequests.length - successfulRequests.length) / completedRequests.length) * 100
        : 0;

    // Calculate response time percentiles
    const sortedTimes = [...this.responseTimes].sort((a, b) => a - b);
    const p50 = this.getPercentile(sortedTimes, 0.5);
    const p95 = this.getPercentile(sortedTimes, 0.95);
    const p99 = this.getPercentile(sortedTimes, 0.99);

    // Calculate throughput (requests per second over last minute)
    const oneMinuteAgo = now - 60000;
    const recentRequests = completedRequests.filter(
      (m) => m.endTime && m.startTime + oneMinuteAgo > 0,
    );
    const throughput = recentRequests.length / 60;

    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const metrics: PerformanceMetrics = {
      requestCount: completedRequests.length,
      averageResponseTime:
        this.responseTimes.length > 0
          ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
          : 0,
      minResponseTime: sortedTimes.length > 0 ? sortedTimes[0] : 0,
      maxResponseTime: sortedTimes.length > 0 ? sortedTimes[sortedTimes.length - 1] : 0,
      p50ResponseTime: p50,
      p95ResponseTime: p95,
      p99ResponseTime: p99,
      errorRate,
      throughput,
      activeConnections: this.requestMetrics.size,
      memoryUsage: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss,
      },
      cpuUsage: {
        user: cpuUsage.user / 1000000, // Convert to seconds
        system: cpuUsage.system / 1000000,
      },
      timestamp: new Date(),
    };

    return metrics;
  }

}
