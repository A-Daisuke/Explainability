function __method_wrapper__() {
  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;

    this.logger.info(`Circuit breaker '${this.name}' state change`, {
      from: oldState,
      to: newState,
      failures: this.failures,
      successes: this.successes,
    });

    // Reset counters based on new state
    switch (newState) {
      case CircuitState.CLOSED:
        this.failures = 0;
        this.successes = 0;
        this.halfOpenRequests = 0;
        delete this.nextAttempt;
        break;

      case CircuitState.OPEN:
        this.successes = 0;
        this.halfOpenRequests = 0;
        this.nextAttempt = new Date(Date.now() + this.config.timeout);
        break;

      case CircuitState.HALF_OPEN:
        this.successes = 0;
        this.failures = 0;
        this.halfOpenRequests = 0;
        break;
    }

    // Emit state change event
    if (this.eventBus) {
      this.eventBus.emit('circuitbreaker:state-change', {
        name: this.name,
        from: oldState,
        to: newState,
        metrics: this.getMetrics(),
      });
    }
  }

}
