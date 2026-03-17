function __method_wrapper__() {
  private async createAlert(alertData: Partial<TruthAlert>): Promise<string> {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    const alert: TruthAlert = {
      id: alertId,
      timestamp: new Date(),
      severity: alertData.severity || 'warning',
      type: alertData.type || 'threshold_violation',
      message: alertData.message || 'Unknown alert',
      source: 'truth-telemetry',
      context: alertData.context || {},
      thresholds: [],
      actions: [],
      escalationPath: [],
      resolved: false,
      ...alertData,
    };
    
    this.activeAlerts.set(alertId, alert);
    
    this.logger.warn('Truth telemetry alert created', {
      alertId,
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
    });
    
    this.emit('alert:created', { alert });
    
    // Execute alert actions
    await this.alertManager.executeAlertActions(alert);
    
    return alertId;
  }

}
