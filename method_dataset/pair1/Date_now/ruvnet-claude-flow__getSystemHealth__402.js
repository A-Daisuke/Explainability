function __method_wrapper__() {
  async getSystemHealth(): Promise<SystemHealth> {
    const components = Array.from(this.componentStatuses.values());
    const healthyComponents = components.filter((c) => c.status === 'healthy').length;
    const unhealthyComponents = components.filter((c) => c.status === 'unhealthy').length;
    const warningComponents = components.filter((c) => c.status === 'warning').length;

    let overallStatus: 'healthy' | 'unhealthy' | 'warning' = 'healthy';
    if (unhealthyComponents > 0) {
      overallStatus = 'unhealthy';
    } else if (warningComponents > 0) {
      overallStatus = 'warning';
    }

    return {
      overall: overallStatus,
      components: Object.fromEntries(this.componentStatuses),
      metrics: {
        totalComponents: components.length,
        healthyComponents,
        unhealthyComponents,
        warningComponents,
        uptime: Date.now() - (this.initialized ? Date.now() : 0),
      },
      timestamp: Date.now(),
    };
  }

}
