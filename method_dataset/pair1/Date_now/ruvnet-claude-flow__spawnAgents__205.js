function __method_wrapper__() {
  async spawnAgents() {
    this.log(`Phase 2: Spawning ${this.config.agentsPerSwarm} agents per swarm`);
    
    const startTime = Date.now();
    const swarmIds = Array.from(this.activeSwarms);
    
    try {
      const agentPromises = swarmIds.flatMap(swarmId =>
        Array.from({ length: this.config.agentsPerSwarm }, (_, i) =>
          this.spawnAgent(swarmId, i)
        )
      );
      
      const agents = await Promise.all(agentPromises);
      this.metrics.agentsSpawned = agents.length;
      
      const duration = Date.now() - startTime;
      this.log(`Spawned ${agents.length} agents in ${duration}ms`, 'success');
      
    } catch (error) {
      this.log(`Failed to spawn agents: ${error.message}`, 'error');
      throw error;
    }
  }

}
