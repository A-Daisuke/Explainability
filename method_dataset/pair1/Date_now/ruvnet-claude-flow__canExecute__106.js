function __method_wrapper__() {
  canExecute(): boolean {
    const now = Date.now();

    switch (this.state) {
      case CircuitBreakerState.CLOSED:
        return true;

      case CircuitBreakerState.OPEN:
        if (now - this.lastFailureTime >= this.recoveryTimeout) {
          this.state = CircuitBreakerState.HALF_OPEN;
          this.successCount = 0;
          return true;
        }
        return false;

      case CircuitBreakerState.HALF_OPEN:
        return this.successCount < this.halfOpenMaxRequests;

      default:
        return false;
    }
  }

}
