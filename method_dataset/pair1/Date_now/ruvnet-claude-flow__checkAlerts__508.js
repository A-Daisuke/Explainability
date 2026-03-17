function __method_wrapper__() {
  private checkAlerts(data: MonitorData): void {
    const newAlerts: AlertData[] = [];

    // Check system thresholds
    if (data.system.cpu > this.options.threshold) {
      newAlerts.push({
        id: 'cpu-high',
        type: 'warning',
        message: `CPU usage high: ${data.system.cpu.toFixed(1)}%`,
        component: 'system',
        timestamp: Date.now(),
        acknowledged: false,
      });
    }

    if (data.system.memory > 800) {
      newAlerts.push({
        id: 'memory-high',
        type: 'warning',
        message: `Memory usage high: ${data.system.memory.toFixed(0)}MB`,
        component: 'system',
        timestamp: Date.now(),
        acknowledged: false,
      });
    }

    // Check component status
    for (const [name, component] of Object.entries(data.components)) {
      if (component.status === 'error') {
        newAlerts.push({
          id: `component-error-${name}`,
          type: 'error',
          message: `Component ${name} is in error state`,
          component: name,
          timestamp: Date.now(),
          acknowledged: false,
        });
      }

      if (component.load > this.options.threshold) {
        newAlerts.push({
          id: `component-load-${name}`,
          type: 'warning',
          message: `Component ${name} load high: ${component.load.toFixed(1)}%`,
          component: name,
          timestamp: Date.now(),
          acknowledged: false,
        });
      }
    }

    // Update alerts list (keep only recent ones)
    this.alerts = [...this.alerts, ...newAlerts]
      .filter((alert) => Date.now() - alert.timestamp < 300000) // 5 minutes
      .slice(-10); // Keep max 10 alerts
  }

}
