function __method_wrapper__() {
  private async checkThresholds(): Promise<void> {
    if (!this.config.enabled) return;
    
    // Check cooldown period
    if (Date.now() - this.lastRollback < this.config.monitoring.cooldown) {
      return;
    }

    try {
      const metrics = await this.collectMetrics();
      this.metrics.push(metrics);
      
      // Keep only recent metrics (last hour)
      const oneHourAgo = Date.now() - 3600000;
      this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
      
      const violations = this.evaluateThresholds(metrics);
      
      if (violations.length > 0) {
        this.emit('threshold_violated', { metrics, violations });
        
        // Check grace period
        const recentViolations = this.metrics
          .filter(m => m.timestamp > Date.now() - this.config.monitoring.gracePeriod)
          .filter(m => this.evaluateThresholds(m).length > 0);
        
        if (recentViolations.length >= 2) {
          this.triggerRollback(metrics, violations);
        }
      }
      
    } catch (error) {
      this.emit('monitoring_error', error);
    }
  }

}
