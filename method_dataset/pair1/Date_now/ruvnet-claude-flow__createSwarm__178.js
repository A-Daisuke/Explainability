function __method_wrapper__() {
  async createSwarm(index) {
    const swarmStartTime = Date.now();
    
    try {
      const swarmId = await this.swarmCoordinator.createSwarm({
        objective: `Load test swarm ${index}`,
        strategy: 'auto',
        topology: 'mesh',
        maxAgents: this.config.agentsPerSwarm
      });
      
      const duration = Date.now() - swarmStartTime;
      this.metrics.responseTimes.push(duration);
      
      return swarmId;
      
    } catch (error) {
      this.metrics.errors.push({
        message: error.message,
        timestamp: Date.now(),
        phase: 'swarm_creation',
        index
      });
      throw error;
    }
  }

}
