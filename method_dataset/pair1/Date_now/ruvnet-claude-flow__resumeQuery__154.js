function __method_wrapper__() {
  async resumeQuery(queryId: string): Promise<boolean> {
    const controlled = this.controlledQueries.get(queryId);
    if (!controlled) {
      throw new Error(`Query not found: ${queryId}`);
    }

    if (!controlled.isPaused || controlled.status !== 'paused') {
      this.logger.warn('Query is not paused', { queryId, status: controlled.status });
      return false;
    }

    // In a real implementation, we'd resume from saved state
    // For now, mark as resumed
    controlled.isPaused = false;
    controlled.status = 'running';
    controlled.resumedAt = Date.now();

    this.logger.info('Query resumed', { queryId });
    this.emit('query:resumed', { queryId });

    return true;
  }

}
