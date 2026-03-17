function __method_wrapper__() {
  async trackPerformance(operation, duration, success = true, metadata = {}) {
    const perfData = {
      operation,
      duration,
      success,
      timestamp: Date.now(),
      metadata,
    };

    // Store individual performance record
    await this.store(`perf:${operation}:${Date.now()}`, perfData, {
      namespace: 'performance',
      ttl: 86400, // 24 hours
    });

    // Update aggregated stats
    const statsKey = `stats:${operation}`;
    const stats = (await this.retrieve(statsKey, { namespace: 'performance' })) || {
      count: 0,
      successCount: 0,
      totalDuration: 0,
      avgDuration: 0,
      minDuration: Infinity,
      maxDuration: 0,
    };

    stats.count++;
    if (success) stats.successCount++;
    stats.totalDuration += duration;
    stats.avgDuration = stats.totalDuration / stats.count;
    stats.minDuration = Math.min(stats.minDuration, duration);
    stats.maxDuration = Math.max(stats.maxDuration, duration);
    stats.successRate = stats.successCount / stats.count;

    return this.store(statsKey, stats, { namespace: 'performance' });
  }

}
