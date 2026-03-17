function __method_wrapper__() {
  getMonitoringStatistics(): {
    metricsCount: number;
    activeAlerts: number;
    alertRules: number;
    healthChecks: number;
    dashboards: number;
    uptime: number;
  } {
    return {
      metricsCount: this.timeSeries.size,
      activeAlerts: this.activeAlerts.size,
      alertRules: this.alertRules.size,
      healthChecks: this.healthChecks.size,
      dashboards: this.dashboards.size,
      uptime: Date.now() - this.lastMetricsUpdate.getTime(),
    };
  }

}
