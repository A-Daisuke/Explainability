function __method_wrapper__() {
  recordRequestEnd(metrics: RequestMetrics, response?: MCPResponse, error?: Error): void {
    metrics.endTime = Date.now();
    const duration = metrics.endTime - metrics.startTime;

    // Update response time tracking
    this.requestTimes.push(duration);
    if (this.requestTimes.length > 1000) {
      this.requestTimes.shift(); // Keep only last 1000 requests
    }

    const success = !error && (!response || !response.error);
    metrics.success = success;
    const errorMessage = error?.message || response?.error?.message;
    if (errorMessage) {
      metrics.error = errorMessage;
    }

    if (success) {
      this.metrics.successfulRequests++;
      this.circuitBreaker.recordSuccess();
    } else {
      this.metrics.failedRequests++;
      this.circuitBreaker.recordFailure();
    }

    // Update average response time
    this.metrics.averageResponseTime = this.calculateAverageResponseTime();

    this.logger.debug('Request completed', {
      requestId: metrics.requestId,
      sessionId: metrics.sessionId,
      method: metrics.method,
      duration,
      success,
      error: metrics.error,
    });
  }

}
