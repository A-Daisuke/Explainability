function __method_wrapper__() {
  async spawnAgent(type, name = null) {
    if (!this.swarmActive) {
      this.ui.addLog('warning', 'Swarm not active - cannot spawn agent');
      return null;
    }

    const agentId = `agent-${type}-${Date.now()}`;
    const agent = {
      id: agentId,
      type,
      name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
      status: 'idle',
      tasks: 0,
      capabilities: this.getAgentCapabilities(type),
      spawnTime: new Date(),
    };

    this.agents.set(agentId, agent);
    this.updateSwarmStatus();

    this.ui.addLog('success', `Spawned ${type} agent: ${agent.name}`);
    return agentId;
  }

}
