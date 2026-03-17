function __method_wrapper__() {
  async recordMetric(metric: Omit<AnalyticsMetric, 'id' | 'timestamp'>): Promise<void> {
    const fullMetric: AnalyticsMetric = {
      id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...metric,
    };

    const key = `${metric.category}-${metric.name}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }

    const metricArray = this.metrics.get(key)!;
    metricArray.push(fullMetric);

    // Keep only recent metrics in memory (configurable retention)
    const retentionPeriod = 24 * 60 * 60 * 1000; // 24 hours
    const cutoff = Date.now() - retentionPeriod;
    const filteredMetrics = metricArray.filter((m) => m.timestamp.getTime() > cutoff);
    this.metrics.set(key, filteredMetrics);

    // Persist to disk for longer-term storage
    await this.persistMetric(fullMetric);

    this.emit('metric:recorded', fullMetric);

    // Check for anomalies and generate insights
    await this.checkForAnomalies(key, fullMetric);
  }

}
