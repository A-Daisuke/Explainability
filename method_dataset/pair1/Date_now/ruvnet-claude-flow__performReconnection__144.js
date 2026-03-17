function __method_wrapper__() {
  private async performReconnection(): Promise<boolean> {
    this.state.attempts++;
    this.state.lastAttempt = new Date();

    this.logger.info('Attempting reconnection', {
      attempt: this.state.attempts,
      maxRetries: this.config.maxRetries,
      delay: this.state.nextDelay,
    });

    this.emit('attemptStart', {
      attempt: this.state.attempts,
      delay: this.state.nextDelay,
    });

    try {
      // Disconnect first if needed
      if (this.client.isConnected()) {
        await this.client.disconnect();
      }

      // Attempt to reconnect
      await this.client.connect();

      // Success!
      this.logger.info('Reconnection successful', {
        attempts: this.state.attempts,
      });

      this.emit('success', {
        attempts: this.state.attempts,
        duration: Date.now() - this.state.lastAttempt.getTime(),
      });

      // Reset state if configured
      if (this.config.resetAfterSuccess) {
        this.reset();
      }

      return true;
    } catch (error) {
      this.state.lastError = error as Error;

      this.logger.error('Reconnection failed', {
        attempt: this.state.attempts,
        error: (error as Error).message,
      });

      this.emit('attemptFailed', {
        attempt: this.state.attempts,
        error: error as Error,
      });

      // Calculate next delay with exponential backoff
      this.calculateNextDelay();

      // Schedule next attempt if within retry limit
      if (this.state.attempts < this.config.maxRetries && this.state.isReconnecting) {
        this.scheduleReconnect();
      } else if (this.state.attempts >= this.config.maxRetries) {
        this.logger.error('Max reconnection attempts reached');
        this.emit('maxRetriesExceeded', this.state);
        this.state.isReconnecting = false;
      }

      return false;
    }
  }

}
