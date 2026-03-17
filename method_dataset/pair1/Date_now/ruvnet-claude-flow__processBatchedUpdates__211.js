function __method_wrapper__() {
  processBatchedUpdates(viewName) {
    const queue = this.updateQueues.get(viewName);
    if (!queue || queue.length === 0) return;

    const startTime = Date.now();

    // Group updates by type
    const groupedUpdates = this.groupUpdatesByType(queue);

    // Apply updates
    this.applyUpdatesToView(viewName, groupedUpdates);

    // Clear processed updates
    queue.length = 0;

    // Update metrics
    const latency = Date.now() - startTime;
    this.updateMetrics.updateLatency.push(latency);
    this.updateMetrics.batchedUpdates++;

    // Keep only last 100 latency measurements
    if (this.updateMetrics.updateLatency.length > 100) {
      this.updateMetrics.updateLatency.shift();
    }

    // Clear timer
    this.updateTimers.delete(viewName);
  }

}
