function __method_wrapper__() {
  async shutdown(): Promise<void> {
    if (!this.initialized || this.shutdownInProgress) {
      return;
    }

    this.shutdownInProgress = true;
    this.logger.info('Shutting down orchestrator...');
    const shutdownStart = Date.now();

    try {
      // Stop background tasks
      this.stopBackgroundTasks();

      // Save current state
      await this.sessionManager.persistSessions();

      // Process any remaining critical tasks
      await this.processShutdownTasks();

      // Terminate all sessions
      await this.sessionManager.terminateAllSessions();

      // Shutdown components with timeout
      await Promise.race([
        this.shutdownComponents(),
        delay(this.config.orchestrator.shutdownTimeout),
      ]);

      const shutdownDuration = Date.now() - shutdownStart;
      this.eventBus.emit(SystemEvents.SYSTEM_SHUTDOWN, { reason: 'Graceful shutdown' });
      this.logger.info('Orchestrator shutdown complete', { duration: shutdownDuration });
    } catch (error) {
      this.logger.error('Error during shutdown', error);

      // Force shutdown if graceful shutdown fails
      await this.emergencyShutdown();

      throw new ShutdownError('Failed to shutdown gracefully', { error });
    } finally {
      this.initialized = false;
      this.shutdownInProgress = false;
    }
  }

}
