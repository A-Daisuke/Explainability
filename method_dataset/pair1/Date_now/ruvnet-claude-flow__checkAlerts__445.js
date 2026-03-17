function __method_wrapper__() {
  private checkAlerts(): void {
    const metrics = this.getCurrentMetrics();

    for (const rule of this.alertRules.values()) {
      if (!rule.enabled) continue;

      const value = this.getMetricValue(metrics, rule.metric);
      const triggered = this.evaluateCondition(value, rule.operator, rule.threshold);

      const existingAlert = Array.from(this.activeAlerts.values()).find(
        (a) => a.ruleId === rule.id && !a.resolvedAt,
      );

      if (triggered && !existingAlert) {
        // Create new alert
        const alert: Alert = {
          id: `alert_${rule.id}_${Date.now()}`,
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity,
          message: `${rule.name}: ${rule.metric} is ${value} (threshold: ${rule.threshold})`,
          triggeredAt: new Date(),
          currentValue: value,
          threshold: rule.threshold,
        };

        this.activeAlerts.set(alert.id, alert);

        this.logger.warn('Alert triggered', {
          alertId: alert.id,
          ruleName: rule.name,
          metric: rule.metric,
          value,
          threshold: rule.threshold,
        });

        this.emit('alertTriggered', alert);
      } else if (!triggered && existingAlert) {
        // Resolve existing alert
        this.resolveAlert(existingAlert.id);
      }
    }
  }

}
