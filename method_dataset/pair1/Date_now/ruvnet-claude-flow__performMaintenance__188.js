function __method_wrapper__() {
  async performMaintenance(): Promise<void> {
    this.logger.debug('Performing terminal pool maintenance');

    // Remove dead terminals
    const deadTerminals: string[] = [];
    for (const [id, pooled] of this.terminals.entries()) {
      if (!pooled.terminal.isAlive()) {
        deadTerminals.push(id);
      }
    }

    // Clean up dead terminals
    for (const id of deadTerminals) {
      this.logger.warn('Removing dead terminal from pool', { terminalId: id });
      this.terminals.delete(id);
      const index = this.availableQueue.indexOf(id);
      if (index !== -1) {
        this.availableQueue.splice(index, 1);
      }
    }

    // Ensure minimum pool size
    const currentSize = this.terminals.size;
    const minSize = Math.min(2, this.maxSize);

    if (currentSize < minSize) {
      const toCreate = minSize - currentSize;
      this.logger.info('Replenishing terminal pool', {
        currentSize,
        minSize,
        creating: toCreate,
      });

      const promises: Promise<void>[] = [];
      for (let i = 0; i < toCreate; i++) {
        promises.push(this.createPooledTerminal());
      }

      await Promise.all(promises);
    }

    // Check for stale terminals that should be recycled
    const now = Date.now();
    const staleTimeout = 300000; // 5 minutes

    for (const [id, pooled] of this.terminals.entries()) {
      if (!pooled.inUse && pooled.terminal.isAlive()) {
        const idleTime = now - pooled.lastUsed.getTime();
        if (idleTime > staleTimeout) {
          this.logger.info('Recycling stale terminal', {
            terminalId: id,
            idleTime,
          });

          // Mark for recycling
          pooled.useCount = this.recycleAfter;
        }
      }
    }
  }

}
