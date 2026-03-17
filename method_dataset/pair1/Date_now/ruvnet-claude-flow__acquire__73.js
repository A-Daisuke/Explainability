function __method_wrapper__() {
  async acquire(): Promise<Terminal> {
    // Try to get an available terminal
    while (this.availableQueue.length > 0) {
      const terminalId = this.availableQueue.shift()!;
      const pooled = this.terminals.get(terminalId);

      if (pooled && pooled.terminal.isAlive()) {
        pooled.inUse = true;
        pooled.lastUsed = new Date();

        this.logger.debug('Terminal acquired from pool', {
          terminalId,
          useCount: pooled.useCount,
        });

        return pooled.terminal;
      }

      // Terminal is dead, remove it
      if (pooled) {
        this.terminals.delete(terminalId);
      }
    }

    // No available terminals, create new one if under limit
    if (this.terminals.size < this.maxSize) {
      await this.createPooledTerminal();
      return this.acquire(); // Recursive call to get the newly created terminal
    }

    // Pool is full, wait for a terminal to become available
    this.logger.info('Terminal pool full, waiting for available terminal');

    const startTime = Date.now();
    const timeout = 30000; // 30 seconds

    while (Date.now() - startTime < timeout) {
      await delay(100);

      // Check if any terminal became available
      const available = Array.from(this.terminals.values()).find(
        (pooled) => !pooled.inUse && pooled.terminal.isAlive(),
      );

      if (available) {
        available.inUse = true;
        available.lastUsed = new Date();
        return available.terminal;
      }
    }

    throw new TerminalError('No terminal available in pool (timeout)');
  }

}
