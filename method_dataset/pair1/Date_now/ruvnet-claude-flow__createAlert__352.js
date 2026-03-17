function __method_wrapper__() {
  private async createAlert(
    rule: AlertRule,
    metric: TruthMetric,
    violation: ThresholdViolation
  ): Promise<string> {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    const alert: TruthAlert = {
      id: alertId,
      timestamp: new Date(),
      severity: rule.severity,
      type: rule.category,
      message: this.generateAlertMessage(rule, metric),
      source: `agent:${metric.agentId}`,
      context: {
        ruleId: rule.id,
        ruleName: rule.name,
        metricType: metric.metricType,
        metricValue: metric.value,
        threshold: rule.threshold,
        operator: rule.operator,
        duration: violation.lastSeen.getTime() - violation.startTime.getTime(),
        violationCount: violation.count,
        agentId: metric.agentId,
        taskId: metric.taskId,
        ...metric.context,
      },
      thresholds: [
        {
          metric: rule.metric,
          operator: rule.operator,
          value: rule.threshold,
          duration: rule.duration,
          severity: rule.severity,
        },
      ],
      actions: [...rule.actions],
      escalationPath: [...rule.escalationPath],
      resolved: false,
    };
    
    this.activeAlerts.set(alertId, alert);
    
    // Update statistics
    this.statistics.totalAlerts++;
    this.statistics.activeAlerts++;
    this.statistics.alertsByType[alert.type] = (this.statistics.alertsByType[alert.type] || 0) + 1;
    this.statistics.alertsBySeverity[alert.severity] = (this.statistics.alertsBySeverity[alert.severity] || 0) + 1;
    
    // Log alert creation
    this.logger.warn('Truth alert created', {
      alertId,
      rule: rule.name,
      metric: metric.metricType,
      value: metric.value,
      threshold: rule.threshold,
      agent: metric.agentId,
    });
    
    // Add to history
    this.addToHistory(alertId, 'created', 'system', { rule: rule.name });
    
    // Emit event
    this.eventBus.emit('truth-alert:created', { alert, rule, metric });
    
    // Execute alert actions
    await this.executeAlertActions(alert);
    
    return alertId;
  }

}
