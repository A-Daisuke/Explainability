class __C__ {
  async stopPerformanceMonitoring() {
    if (!this.performanceMonitor) return {};

    const duration = Date.now() - this.performanceMonitor.startTime;
    const currentMemory = process.memoryUsage().heapUsed;
    
    return {
      averageResponseTime: this.performanceMonitor.responseTimeSum / Math.max(1, this.performanceMonitor.requestCount),
      memoryUsage: {
        initial: this.performanceMonitor.memoryUsage.initial,
        peak: Math.max(this.performanceMonitor.memoryUsage.peak, currentMemory),
        final: currentMemory
      },
      errorRate: this.performanceMonitor.errorCount / Math.max(1, this.performanceMonitor.requestCount),
      totalDuration: duration
    };
  }

}
