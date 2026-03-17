function __method_wrapper__() {
  private async reportPerformanceMetric(
    operation: string,
    duration: number,
    success: boolean,
    error?: string,
    memoryUsage?: number
  ): Promise<void> {
    const metric: PerformanceMetrics = {
      operation,
      duration,
      success,
      timestamp: Date.now(),
      memoryUsage,
      error
    };

    this.performanceMetrics.push(metric);

    // Keep only last 100 metrics
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics.shift();
    }

    // Log performance information
    if (this.bridgeConfig.logLevel === 'debug') {
      const memoryInfo = memoryUsage ? ` (${(memoryUsage / 1024 / 1024).toFixed(2)}MB)` : '';
      console.log(
        chalk.gray(
          `[PERF] ${operation}: ${duration}ms ${success ? '✓' : '✗'}${memoryInfo}`
        )
      );
    }
  }

}
