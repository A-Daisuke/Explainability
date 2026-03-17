function __method_wrapper__() {
  async pauseQuery(queryId: string, reason?: string): Promise<boolean> {
    if (!this.options.allowPause) {
      throw new Error('Pause is not enabled in controller options');
    }

    const controlled = this.controlledQueries.get(queryId);
    if (!controlled) {
      throw new Error(`Query not found: ${queryId}`);
    }

    if (controlled.isPaused || controlled.status !== 'running') {
      this.logger.warn('Query is not in a state to be paused', {
        queryId,
        status: controlled.status,
        isPaused: controlled.isPaused
      });
      return false;
    }

    try {
      // SDK doesn't support true pause, so we interrupt
      // In a real implementation, we'd need to track state and resume
      await controlled.query.interrupt();

      controlled.isPaused = true;
      controlled.status = 'paused';
      controlled.pausedAt = Date.now();

      this.logger.info('Query paused', { queryId, reason });
      this.emit('query:paused', { queryId, reason });

      return true;
    } catch (error) {
      this.logger.error('Failed to pause query', {
        queryId,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

}
