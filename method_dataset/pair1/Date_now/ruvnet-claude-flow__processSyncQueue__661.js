function __method_wrapper__() {
  private async processSyncQueue(): Promise<void> {
    const pendingOps = this.syncQueue.filter((op) => op.status === 'pending');

    for (const operation of pendingOps) {
      try {
        operation.status = 'in_progress';
        await this.executeSyncOperation(operation);
        operation.status = 'completed';

        this.statistics.syncOperations.completed++;
      } catch (error) {
        operation.status = 'failed';
        this.statistics.syncOperations.failed++;
        this.logger.error('Sync operation failed', { operation, error });
      }
    }

    // Remove completed/failed operations older than 1 hour
    const cutoff = new Date(Date.now() - 3600000);
    this.syncQueue = this.syncQueue.filter(
      (op) => op.status === 'pending' || op.timestamp > cutoff,
    );
  }

}
