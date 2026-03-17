function __method_wrapper__() {
  async drain(): Promise<void> {
    this.isShuttingDown = true;

    // Clear eviction timer
    if (this.evictionTimer) {
      clearInterval(this.evictionTimer);
      this.evictionTimer = undefined;
    }

    // Reject all waiting requests
    for (const waiter of this.waitingQueue) {
      clearTimeout(waiter.timeout);
      waiter.reject(new Error('Connection pool is draining'));
    }
    this.waitingQueue = [];

    // Wait for all connections to be released
    const maxWaitTime = 30000; // 30 seconds
    const startTime = Date.now();

    while (true) {
      const inUseCount = Array.from(this.connections.values()).filter((conn) => conn.inUse).length;

      if (inUseCount === 0) break;

      if (Date.now() - startTime > maxWaitTime) {
        this.logger.warn('Timeout waiting for connections to be released', { inUseCount });
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Destroy all connections
    for (const conn of this.connections.values()) {
      await this.destroyConnection(conn);
    }

    this.logger.info('Connection pool drained');
  }

}
