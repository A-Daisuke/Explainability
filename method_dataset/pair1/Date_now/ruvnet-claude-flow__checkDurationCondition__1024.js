function __method_wrapper__() {
  private checkDurationCondition(alert: TruthAlert, condition: string): boolean {
    // Parse condition like "duration > 30m"
    const match = condition.match(/duration\s*([><=]+)\s*(\d+)([mhs])/);
    if (!match) return true;
    
    const operator = match[1];
    const value = parseInt(match[2]);
    const unit = match[3];
    
    const multiplier = unit === 's' ? 1000 : unit === 'm' ? 60000 : 3600000; // hours
    const thresholdMs = value * multiplier;
    const durationMs = Date.now() - alert.timestamp.getTime();
    
    switch (operator) {
      case '>': return durationMs > thresholdMs;
      case '>=': return durationMs >= thresholdMs;
      case '<': return durationMs < thresholdMs;
      case '<=': return durationMs <= thresholdMs;
      case '=': return Math.abs(durationMs - thresholdMs) < 1000;
      default: return true;
    }
  }

}
