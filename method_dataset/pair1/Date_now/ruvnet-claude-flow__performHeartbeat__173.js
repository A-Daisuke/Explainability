function __method_wrapper__() {
  private async performHeartbeat(): Promise<void> {
    if (!this.isMonitoring) {
      return;
    }

    this.logger.debug('Performing heartbeat');

    try {
      // Set timeout for heartbeat response
      this.setHeartbeatTimeout();

      const startTime = Date.now();
      await this.sendHeartbeat();

      // Clear timeout on success
      this.clearHeartbeatTimeout();

      // Update metrics
      this.currentLatency = Date.now() - startTime;
      this.lastHeartbeat = new Date();
      this.missedHeartbeats = 0;

      this.logger.debug('Heartbeat successful', {
        latency: this.currentLatency,
      });

      this.updateHealthStatus('connected', true);

      // Schedule next heartbeat
      this.scheduleHeartbeat();
    } catch (error) {
      this.handleHeartbeatFailure(error as Error);
    }
  }

}
