function __method_wrapper__() {
  private createAlert(
    type: Alert['type'],
    level: Alert['level'],
    message: string,
    details?: any,
  ): void {
    const alert: Alert = {
      id: `${type}_${Date.now()}`,
      timestamp: Date.now(),
      level,
      type,
      message,
      details,
    };

    this.alerts.push(alert);
    this.emit('alert', alert);
    this.logger[level](message);
  }

}
