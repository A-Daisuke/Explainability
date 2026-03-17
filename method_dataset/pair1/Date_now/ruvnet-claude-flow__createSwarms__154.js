function __method_wrapper__() {
  async createSwarms() {
    this.log(`Phase 1: Creating ${this.config.swarms} swarms`);
    
    const startTime = Date.now();
    
    try {
      const swarmPromises = Array.from({ length: this.config.swarms }, (_, i) =>
        this.createSwarm(i)
      );
      
      const swarmIds = await Promise.all(swarmPromises);
      swarmIds.forEach(id => this.activeSwarms.add(id));
      
      this.metrics.swarmsCreated = swarmIds.length;
      const duration = Date.now() - startTime;
      
      this.log(`Created ${swarmIds.length} swarms in ${duration}ms`, 'success');
      
    } catch (error) {
      this.log(`Failed to create swarms: ${error.message}`, 'error');
      throw error;
    }
  }

}
