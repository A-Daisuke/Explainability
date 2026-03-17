function __method_wrapper__() {
  async spawnAgent(options: AgentSpawnOptions): Promise<Agent> {
    if (this.agents.size >= this.config.maxAgents) {
      throw new Error('Maximum agent limit reached');
    }

    const agent = new Agent({
      name: options.name || `${options.type}-${Date.now()}`,
      type: options.type,
      swarmId: this.id,
      capabilities: options.capabilities || this.getDefaultCapabilities(options.type),
    });

    await agent.initialize();

    // Register with Queen
    await this.queen.registerAgent(agent);

    // Store in database
    await this.db.createAgent({
      id: agent.id,
      swarmId: this.id,
      name: agent.name,
      type: agent.type,
      capabilities: JSON.stringify(agent.capabilities),
      status: 'idle',
    });

    // Add to local map
    this.agents.set(agent.id, agent);

    // Setup communication channels
    this.communication.addAgent(agent);

    // Auto-assign to pending tasks if configured
    if (options.autoAssign) {
      await this.assignPendingTasksToAgent(agent);
    }

    this.emit('agentSpawned', { agent });

    return agent;
  }

}
