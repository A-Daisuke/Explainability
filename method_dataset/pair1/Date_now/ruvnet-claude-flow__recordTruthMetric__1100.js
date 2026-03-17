function __method_wrapper__() {
  async recordTruthMetric(metric: Omit<TruthMetric, 'id' | 'timestamp'>): Promise<string> {
    const fullMetric: TruthMetric = {
      id: `metric-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date(),
      ...metric,
    };
    
    this.metricsBuffer.push(fullMetric);
    
    if (this.config.realtimeEnabled) {
      this.emit('metric:recorded', { metric: fullMetric });
    }
    
    return fullMetric.id;
  }

}
