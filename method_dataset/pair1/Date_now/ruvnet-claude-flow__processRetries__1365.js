function __method_wrapper__() {
  private async processRetries(): Promise<void> {
    const now = Date.now();
    const toRetry = this.retryQueue.filter((entry) => {
      const delay = this.calculateDelay(entry.attempts);
      return now >= entry.message.timestamp.getTime() + delay;
    });

    for (const entry of toRetry) {
      if (entry.attempts >= this.config.retryAttempts) {
        // Remove from retry queue and emit exhausted event
        this.retryQueue = this.retryQueue.filter((r) => r !== entry);
        this.emit('retry:exhausted', entry);
      } else {
        // Retry delivery
        try {
          // Simulate retry delivery
          this.logger.debug('Retrying message delivery', {
            messageId: entry.message.id,
            attempt: entry.attempts,
          });

          // Remove from retry queue on success
          this.retryQueue = this.retryQueue.filter((r) => r !== entry);
        } catch (error) {
          // Keep in retry queue for next attempt
          this.logger.warn('Retry attempt failed', {
            messageId: entry.message.id,
            attempt: entry.attempts,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }
  }

}
