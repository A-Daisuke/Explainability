function __method_wrapper__() {
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.logger.info('Stopping health check monitoring');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.eventBus.emit('health:monitor:stopped', {
      timestamp: Date.now(),
    });
  }

}
