function __method_wrapper__() {
  private onFailure(): void {
    this.lastFailureTime = new Date();

    switch (this.state) {
      case CircuitState.CLOSED:
        this.failures++;

        // Check if we should open the circuit
        if (this.failures >= this.config.failureThreshold) {
          this.transitionTo(CircuitState.OPEN);
        }
        break;

      case CircuitState.HALF_OPEN:
        // Single failure in half-open state reopens the circuit
        this.transitionTo(CircuitState.OPEN);
        break;

      case CircuitState.OPEN:
        // Already open, update next attempt time
        this.nextAttempt = new Date(Date.now() + this.config.timeout);
        break;
    }
  }

}
