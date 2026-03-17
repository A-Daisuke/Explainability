function __method_wrapper__() {
  async createTasks() {
    this.log(`Phase 3: Creating ${this.config.tasksPerSwarm} tasks per swarm`);
    
    const startTime = Date.now();
    const swarmIds = Array.from(this.activeSwarms);
    
    try {
      const taskPromises = swarmIds.flatMap(swarmId =>
        Array.from({ length: this.config.tasksPerSwarm }, (_, i) =>
          this.createTask(swarmId, i)
        )
      );
      
      const tasks = await Promise.all(taskPromises);
      this.metrics.tasksCreated = tasks.length;
      
      const duration = Date.now() - startTime;
      this.log(`Created ${tasks.length} tasks in ${duration}ms`, 'success');
      
    } catch (error) {
      this.log(`Failed to create tasks: ${error.message}`, 'error');
      throw error;
    }
  }

}
