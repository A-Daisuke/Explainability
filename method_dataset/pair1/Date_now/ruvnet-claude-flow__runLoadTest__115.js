function __method_wrapper__() {
  async runLoadTest() {
    this.log(`Starting ${this.config.description}`);
    this.log(`Configuration: ${this.config.swarms} swarms, ${this.config.agentsPerSwarm} agents/swarm, ${this.config.tasksPerSwarm} tasks/swarm`);
    
    this.metrics.startTime = Date.now();
    this.isRunning = true;

    try {
      // Phase 1: Create swarms
      await this.createSwarms();
      
      // Phase 2: Spawn agents
      await this.spawnAgents();
      
      // Phase 3: Create tasks
      await this.createTasks();
      
      // Phase 4: Run for duration
      await this.runForDuration();
      
      // Phase 5: Cleanup
      await this.cleanup();
      
      this.metrics.endTime = Date.now();
      this.generateReport();
      
    } catch (error) {
      this.log(`Load test failed: ${error.message}`, 'error');
      this.metrics.errors.push({
        message: error.message,
        timestamp: Date.now(),
        phase: 'main'
      });
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

}
