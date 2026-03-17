function __method_wrapper__() {
  private async checkForAlerts(health: SystemHealth): Promise<void> {
    const unhealthyComponents = Object.values(health.components).filter(
      (component) => component.status === 'unhealthy',
    );

    if (unhealthyComponents.length > 0) {
      const alert = {
        type: 'component_failure',
        severity: 'high',
        message: `${unhealthyComponents.length} component(s) are unhealthy`,
        components: unhealthyComponents.map((c) => c.component),
        timestamp: Date.now(),
      };

      this.eventBus.emit('health:alert', alert);
      this.logger.warn('Health alert triggered:', alert.message);
    }

    // Check system metrics for anomalies
    if (this.lastMetrics) {
      const alerts = [];

      if (this.lastMetrics.cpu > 90) {
        alerts.push({
          type: 'high_cpu',
          severity: 'medium',
          message: `High CPU usage: ${this.lastMetrics.cpu.toFixed(1)}%`,
          value: this.lastMetrics.cpu,
        });
      }

      if (this.lastMetrics.memory > 90) {
        alerts.push({
          type: 'high_memory',
          severity: 'medium',
          message: `High memory usage: ${this.lastMetrics.memory.toFixed(1)}%`,
          value: this.lastMetrics.memory,
        });
      }

      if (this.lastMetrics.errorCount > 10) {
        alerts.push({
          type: 'high_errors',
          severity: 'high',
          message: `High error count: ${this.lastMetrics.errorCount}`,
          value: this.lastMetrics.errorCount,
        });
      }

      alerts.forEach((alert) => {
        this.eventBus.emit('health:alert', {
          ...alert,
          timestamp: Date.now(),
        });
      });
    }
  }

}
