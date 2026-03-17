function __method_wrapper__() {
  start(): void {
    if (this.isRunning) {
      this.logger.warn('Health check manager already running');
      return;
    }

    this.logger.info('Starting health check monitoring');
    this.isRunning = true;

    // Perform initial health check
    this.performHealthCheck();

    // Set up periodic health checks
    this.intervalId = setInterval(() => {
      this.performHealthCheck();
    }, this.config.interval);

    this.eventBus.emit('health:monitor:started', {
      interval: this.config.interval,
      timestamp: Date.now(),
    });
  }

}
