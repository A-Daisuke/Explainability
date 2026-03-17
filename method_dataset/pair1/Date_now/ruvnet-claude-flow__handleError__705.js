function __method_wrapper__() {
  private handleError(data: any): void {
    this.recordMetric('error.count', 1, {
      type: data.type || 'unknown',
      source: data.source || 'unknown',
    });

    // Create critical alert for errors
    if (data.severity === 'critical') {
      const alertId = `error-alert-${Date.now()}`;
      const alert: Alert = {
        id: alertId,
        timestamp: new Date(),
        level: 'critical',
        type: 'system',
        message: `Critical error: ${data.message}`,
        source: data.source || 'unknown',
        context: data,
        acknowledged: false,
        resolved: false,
        escalationLevel: 0,
      };

      this.activeAlerts.set(alertId, alert);
      this.emit('alert:created', { alert });
    }
  }

}
