function __method_wrapper__() {
  async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Provider-specific health check
      const result = await this.doHealthCheck();
      
      this.lastHealthCheck = {
        ...result,
        latency: Date.now() - startTime,
        timestamp: new Date(),
      };
      
      this.emit('health_check', this.lastHealthCheck);
      return this.lastHealthCheck;
      
    } catch (error) {
      this.lastHealthCheck = {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        latency: Date.now() - startTime,
        timestamp: new Date(),
      };
      
      this.emit('health_check', this.lastHealthCheck);
      return this.lastHealthCheck;
    }
  }

}
