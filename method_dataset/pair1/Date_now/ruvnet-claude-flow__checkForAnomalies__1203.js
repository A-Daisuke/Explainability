function __method_wrapper__() {
  private async checkForAnomalies(metricKey: string, metric: AnalyticsMetric): Promise<void> {
    const historical = this.metrics.get(metricKey) || [];
    if (historical.length < 10) return; // Need enough data for baseline

    const recent = historical.slice(-10);
    const average = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
    const stdDev = Math.sqrt(
      recent.reduce((sum, m) => sum + Math.pow(m.value - average, 2), 0) / recent.length,
    );

    const threshold = 2; // 2 standard deviations
    const deviation = Math.abs(metric.value - average) / stdDev;

    if (deviation > threshold) {
      const insight: AnalyticsInsight = {
        id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `Anomaly detected in ${metric.name}`,
        description: `The metric ${metric.name} has deviated significantly from its normal pattern`,
        type: 'anomaly',
        category: metric.category,
        confidence: Math.min(95, deviation * 20),
        impact: deviation > 3 ? 'high' : 'medium',
        priority: deviation > 3 ? 'high' : 'medium',
        data: {
          metrics: [metric.name],
          timeRange: { start: recent[0].timestamp, end: metric.timestamp },
          values: { current: metric.value, average, stdDev },
          baseline: { average, stdDev },
          deviation,
        },
        recommendations: [
          {
            action: 'Investigate the cause of the anomaly',
            effort: 'medium',
            impact: 'Identify potential issues before they become critical',
            implementation: [
              'Check recent deployments or configuration changes',
              'Review system logs for errors or warnings',
              'Monitor related metrics for correlation',
            ],
          },
        ],
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.insights.set(insight.id, insight);
      await this.saveInsight(insight);

      this.emit('anomaly:detected', { metric, insight, deviation });
      this.logger.warn(`Anomaly detected in ${metric.name}`, {
        current: metric.value,
        average,
        deviation,
      });
    }
  }

}
