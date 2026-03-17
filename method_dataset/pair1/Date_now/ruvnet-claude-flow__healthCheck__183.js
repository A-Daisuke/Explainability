function __method_wrapper__() {
  async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const result: HealthCheckResult = {
      healthy: false,
      state: this.state,
      uptime: this.getUptime(),
      lastRestart: this.lastRestart,
      components: {
        server: false,
        transport: false,
        sessions: false,
        tools: false,
        auth: false,
        loadBalancer: false,
      },
    };

    try {
      if (!this.server || this.state !== LifecycleState.RUNNING) {
        result.error = 'Server not running';
        return result;
      }

      // Check server health
      const serverHealth = await this.server.getHealthStatus();
      result.components.server = serverHealth.healthy;
      result.metrics = serverHealth.metrics;

      if (serverHealth.error) {
        result.error = serverHealth.error;
      }

      // Check individual components
      result.components.transport = serverHealth.metrics?.transportConnections !== undefined;
      result.components.sessions = serverHealth.metrics?.activeSessions !== undefined;
      result.components.tools = (serverHealth.metrics?.registeredTools || 0) > 0;
      result.components.auth = serverHealth.metrics?.authenticatedSessions !== undefined;
      result.components.loadBalancer = serverHealth.metrics?.rateLimitedRequests !== undefined;

      // Overall health assessment
      result.healthy =
        result.components.server &&
        result.components.transport &&
        result.components.sessions &&
        result.components.tools;

      const checkDuration = Date.now() - startTime;
      if (result.metrics) {
        result.metrics.healthCheckDuration = checkDuration;
      }

      this.logger.debug('Health check completed', {
        healthy: result.healthy,
        duration: checkDuration,
        components: result.components,
      });

      return result;
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Health check failed', error);
      return result;
    }
  }

}
