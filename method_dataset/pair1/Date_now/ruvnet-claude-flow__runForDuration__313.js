function __method_wrapper__() {
  async runForDuration() {
    this.log(`Phase 4: Running load test for ${this.config.duration / 1000}s`);
    
    const endTime = Date.now() + this.config.duration;
    const checkInterval = 10000; // Check every 10 seconds
    
    while (Date.now() < endTime && this.isRunning) {
      try {
        // Perform periodic operations to maintain load
        await this.performPeriodicOperations();
        
        // Report progress
        const elapsed = Date.now() - this.metrics.startTime;
        const remaining = endTime - Date.now();
        
        if (elapsed % 60000 < checkInterval) { // Report every minute
          this.log(`Load test progress: ${Math.floor(elapsed / 1000)}s elapsed, ${Math.floor(remaining / 1000)}s remaining`);
          await this.reportCurrentMetrics();
        }
        
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        
      } catch (error) {
        this.log(`Error during load test execution: ${error.message}`, 'warning');
        this.metrics.errors.push({
          message: error.message,
          timestamp: Date.now(),
          phase: 'execution'
        });
      }
    }
    
    this.log('Load test duration completed', 'success');
  }

}
