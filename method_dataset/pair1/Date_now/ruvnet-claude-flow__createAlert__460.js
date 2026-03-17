function __method_wrapper__() {
  private createAlert(rule: AlertRule, triggeringPoint: MetricPoint): void {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const alert: Alert = {
      id: alertId,
      timestamp: new Date(),
      level: rule.severity,
      type: this.getAlertTypeFromMetric(rule.metric),
      message: `${rule.name}: ${rule.metric} ${rule.condition} ${rule.threshold} (current: ${triggeringPoint.value})`,
      source: 'real-time-monitor',
      context: {
        ruleId: rule.id,
        metric: rule.metric,
        value: triggeringPoint.value,
        threshold: rule.threshold,
        tags: { ...rule.tags, ...triggeringPoint.tags },
      },
      acknowledged: false,
      resolved: false,
      escalationLevel: 0,
    };

    this.activeAlerts.set(alertId, alert);
    this.alertHistory.push(alert);

    this.logger.warn('Alert created', {
      alertId,
      rule: rule.name,
      metric: rule.metric,
      value: triggeringPoint.value,
      threshold: rule.threshold,
    });

    this.emit('alert:created', { alert });

    // Execute alert actions
    this.executeAlertActions(rule, alert);
  }

}
