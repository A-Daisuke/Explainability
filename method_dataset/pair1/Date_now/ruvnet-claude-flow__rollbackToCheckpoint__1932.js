function __method_wrapper__() {
  public async rollbackToCheckpoint(
    snapshotId: string,
    strategy: 'graceful' | 'immediate' = 'graceful'
  ): Promise<boolean> {
    try {
      const snapshot = await this.stateManager.getSnapshot(snapshotId);
      if (!snapshot) {
        throw new Error(`Snapshot not found: ${snapshotId}`);
      }
      
      const startTime = Date.now();
      
      // Execute rollback based on strategy
      let success: boolean;
      if (strategy === 'graceful') {
        success = await this.performGracefulRollback(snapshot);
      } else {
        success = await this.performImmediateRollback(snapshot);
      }
      
      const duration = Date.now() - startTime;
      
      // Record in history
      await this.rollbackHistory.addEntry(
        snapshot,
        'manual',
        `Manual rollback to checkpoint ${snapshotId}`,
        undefined, // No trigger metrics for manual rollback
        strategy,
        success,
        duration,
        [], // No recovery attempts for manual rollback
        [], // Would need to run verification
        success,
        !success
      );
      
      if (success) {
        this.emit('manual_rollback_success', { snapshotId, strategy, duration });
      } else {
        this.emit('manual_rollback_failed', { snapshotId, strategy, duration });
      }
      
      return success;
      
    } catch (error) {
      this.emit('error', new Error(`Manual rollback failed: ${error}`));
      return false;
    }
  }

}
