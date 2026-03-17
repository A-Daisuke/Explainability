function __method_wrapper__() {
  public async executeRecovery(
    metrics: SystemMetrics,
    triggerReason: string,
    preferredSnapshot?: string
  ): Promise<boolean> {
    if (this.isRecovering) {
      this.emit('recovery_blocked', 'Recovery already in progress');
      return false;
    }

    this.isRecovering = true;
    
    try {
      this.emit('recovery_started', { reason: triggerReason, metrics });
      
      // Get appropriate snapshot
      const snapshots = this.stateManager.listSnapshots();
      const snapshot = preferredSnapshot 
        ? await this.stateManager.getSnapshot(preferredSnapshot)
        : snapshots[0]; // Most recent snapshot
      
      if (!snapshot) {
        throw new Error('No snapshot available for recovery');
      }

      // Get applicable strategies
      const applicableStrategies = Array.from(this.strategies.values())
        .filter(s => s.enabled && s.conditions(metrics))
        .sort((a, b) => a.priority - b.priority);

      if (applicableStrategies.length === 0) {
        throw new Error('No applicable recovery strategies found');
      }

      const context: RecoveryContext = {
        triggeredBy: triggerReason,
        reason: triggerReason,
        metrics,
        previousAttempts: this.recoveryHistory.slice(-10) // Last 10 attempts
      };

      // Execute strategies in priority order
      for (const strategy of applicableStrategies) {
        const success = await this.executeStrategy(strategy, snapshot, context);
        
        if (success) {
          this.emit('recovery_success', { 
            strategy: strategy.name, 
            snapshot: snapshot.id,
            duration: Date.now() - metrics.timestamp 
          });
          return true;
        }
      }

      throw new Error('All recovery strategies failed');
      
    } catch (error) {
      this.emit('recovery_failed', { error: error?.toString(), metrics });
      return false;
    } finally {
      this.isRecovering = false;
    }
  }

}
