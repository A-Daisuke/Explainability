function __method_wrapper__() {
  async performHealthCheck(): Promise<SystemHealth> {
    const startTime = Date.now();

    try {
      this.logger.debug('Performing system health check');

      // Get system health from integration manager
      const systemHealth = await this.systemIntegration.getSystemHealth();

      // Perform individual component checks
      const componentChecks = await this.checkAllComponents();

      // Collect system metrics if enabled
      if (this.config.enableMetrics) {
        this.lastMetrics = await this.collectSystemMetrics();
      }

      // Store health history
      this.storeHealthHistory(componentChecks);

      // Check for alerts
      if (this.config.enableAlerts) {
        await this.checkForAlerts(systemHealth);
      }

      const duration = Date.now() - startTime;
      this.logger.debug(`Health check completed in ${duration}ms`);

      // Emit health check event
      this.eventBus.emit('health:check:completed', {
        health: systemHealth,
        metrics: this.lastMetrics,
        duration,
        timestamp: Date.now(),
      });

      return systemHealth;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Health check failed:', getErrorMessage(error));

      this.eventBus.emit('health:check:failed', {
        error: getErrorMessage(error),
        duration,
        timestamp: Date.now(),
      });

      throw error;
    }
  }

}
