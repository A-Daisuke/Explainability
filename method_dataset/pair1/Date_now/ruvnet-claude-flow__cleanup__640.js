function __method_wrapper__() {
  private cleanup(): void {
    const now = Date.now();

    // Clean up old request metrics
    for (const [id, metrics] of this.requestMetrics.entries()) {
      if (now - metrics.startTime > this.config.requestTimeout) {
        this.requestMetrics.delete(id);
      }
    }

    // Clean up old response times
    if (this.responseTimes.length > this.config.maxResponseTimeHistory) {
      this.responseTimes = this.responseTimes.slice(-this.config.maxResponseTimeHistory);
    }
  }

}
