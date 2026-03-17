function __method_wrapper__() {
  private async completeRecovery(success: boolean): Promise<void> {
    if (!this.isRecoveryActive) {
      return;
    }

    const duration = this.recoveryStartTime ? Date.now() - this.recoveryStartTime.getTime() : 0;

    this.isRecoveryActive = false;
    this.recoveryStartTime = undefined;

    if (success) {
      this.metrics.successfulRecoveries++;
      this.metrics.totalRecoveryTime += duration;

      // Disable fallback mode
      this.fallbackCoordinator.disableCLIFallback();

      // Process any queued operations
      await this.fallbackCoordinator.processQueue();

      // Reset health monitor
      this.healthMonitor.reset();

      // Record reconnection
      this.stateManager.recordEvent({
        type: 'reconnect',
        sessionId: this.generateSessionId(),
        details: { duration },
      });

      this.logger.info('Recovery completed successfully', { duration });
      this.emit('recoveryComplete', { success: true, duration });
    } else {
      this.metrics.failedRecoveries++;

      this.logger.error('Recovery failed');
      this.emit('recoveryComplete', { success: false, duration });

      // Keep fallback active
      this.emit('fallbackPermanent');
    }
  }

}
