function __method_wrapper__() {
    this.eventBus.on('system:error', (error) => {
      const component = error.component || 'system';

      if (!this.errorHistory.has(component)) {
        this.errorHistory.set(component, []);
      }

      const history = this.errorHistory.get(component)!;
      history.push({
        message: error.message || error.error,
        timestamp: Date.now(),
        stack: error.stack,
      });

      // Keep only last 50 errors per component
      if (history.length > 50) {
        history.shift();
      }
    });

}
