function __method_wrapper__() {
  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Simple health check request
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(this.config.apiUrl || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      
      const latency = Date.now() - startTime;
      const healthy = response.ok || response.status === 429; // Rate limit is still "healthy"
      
      this.lastHealthCheck = {
        healthy,
        latency,
        error: healthy ? undefined : `Status: ${response.status}`,
        timestamp: new Date(),
      };

      this.logger.debug('Claude API health check completed', this.lastHealthCheck);
      this.emit('health_check', this.lastHealthCheck);
      
      return this.lastHealthCheck;
    } catch (error) {
      const latency = Date.now() - startTime;
      
      this.lastHealthCheck = {
        healthy: false,
        latency,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };

      this.logger.warn('Claude API health check failed', this.lastHealthCheck);
      this.emit('health_check', this.lastHealthCheck);
      
      return this.lastHealthCheck;
    }
  }

}
