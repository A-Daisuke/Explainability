function __method_wrapper__() {
  public async addEntry(
    snapshot: SystemSnapshot,
    triggerType: 'manual' | 'automatic',
    triggerReason: string,
    triggerMetrics: SystemMetrics | undefined,
    recoveryStrategy: string,
    recoverySuccess: boolean,
    recoveryDuration: number,
    recoveryAttempts: RecoveryAttempt[],
    verificationChecks: HealthCheck[],
    verificationPassed: boolean,
    rollbackRequired: boolean
  ): Promise<string> {
    const id = this.generateHistoryId();
    
    const entry: RollbackHistoryEntry = {
      id,
      timestamp: Date.now(),
      snapshot,
      trigger: {
        type: triggerType,
        reason: triggerReason,
        metrics: triggerMetrics
      },
      recovery: {
        strategy: recoveryStrategy,
        success: recoverySuccess,
        duration: recoveryDuration,
        attempts: recoveryAttempts
      },
      verification: {
        passed: verificationPassed,
        checks: verificationChecks,
        rollbackRequired
      }
    };

    try {
      await this.storeHistoryEntry(entry);
      this.history.set(id, entry);
      
      // Cleanup if we exceed max size
      await this.cleanupOldEntries();
      
      this.emit('entry_added', entry);
      return id;
      
    } catch (error) {
      this.emit('error', new Error(`Failed to add history entry: ${error}`));
      throw error;
    }
  }

}
