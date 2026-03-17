class __C__ {
  async recordMetric(metricName, value, metadata = {}) {
    const timestamp = Date.now();
    const metricKey = `metric:${metricName}:${timestamp}`;

    return this.store(
      metricKey,
      {
        name: metricName,
        value,
        timestamp,
        metadata,
      },
      {
        namespace: 'metrics',
        ttl: 86400, // 24 hours
      },
    );
  }

}
