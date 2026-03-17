function __method_wrapper__() {
  isHealthy(): boolean {
    if (!this.terminal.isAlive()) {
      return false;
    }

    // Check if terminal is responsive
    if (this.lastCommandTime) {
      const timeSinceLastCommand = Date.now() - this.lastCommandTime.getTime();
      if (timeSinceLastCommand > 300000) {
        // 5 minutes
        // Terminal might be stale, do a health check
        this.performHealthCheck().catch((error) => {
          this.logger.warn('Health check failed', { sessionId: this.id, error });
        });
      }
    }

    return true;
  }

}
