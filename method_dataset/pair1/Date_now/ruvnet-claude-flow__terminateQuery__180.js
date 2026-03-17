function __method_wrapper__() {
  async terminateQuery(queryId: string, reason?: string): Promise<boolean> {
    const controlled = this.controlledQueries.get(queryId);
    if (!controlled) {
      throw new Error(`Query not found: ${queryId}`);
    }

    if (controlled.status === 'terminated') {
      return true;
    }

    try {
      await controlled.query.interrupt();

      controlled.status = 'terminated';
      controlled.terminatedAt = Date.now();
      this.stopMonitoring(queryId);

      this.logger.info('Query terminated', { queryId, reason });
      this.emit('query:terminated', { queryId, reason });

      return true;
    } catch (error) {
      this.logger.error('Failed to terminate query', {
        queryId,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

}
