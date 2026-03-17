function __method_wrapper__() {
  private async checkComponent(componentName: string): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const component = this.systemIntegration.getComponent(componentName);

      if (!component) {
        return {
          component: componentName,
          healthy: false,
          message: 'Component not found',
          timestamp: Date.now(),
        };
      }

      // Try to call health check method if available
      if (typeof component.healthCheck === 'function') {
        const result = await Promise.race([
          component.healthCheck(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Health check timeout')), this.config.timeout),
          ),
        ]);
        return result as HealthCheckResult;
      }

      // Basic availability check
      const duration = Date.now() - startTime;
      return {
        component: componentName,
        healthy: true,
        message: 'Component available',
        metrics: { responseTime: duration },
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        component: componentName,
        healthy: false,
        message: getErrorMessage(error),
        timestamp: Date.now(),
      };
    }
  }

}
