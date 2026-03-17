function __method_wrapper__() {
  async checkHealth(): Promise<HealthStatus> {
    try {
      const startTime = Date.now();

      // Send heartbeat ping
      await this.sendHeartbeat();

      // Calculate latency
      this.currentLatency = Date.now() - startTime;
      this.lastHeartbeat = new Date();
      this.missedHeartbeats = 0;

      this.updateHealthStatus('connected', true);

      return this.getHealthStatus();
    } catch (error) {
      this.logger.error('Health check failed', error);
      this.handleHeartbeatFailure(error as Error);
      return this.getHealthStatus();
    }
  }

}
