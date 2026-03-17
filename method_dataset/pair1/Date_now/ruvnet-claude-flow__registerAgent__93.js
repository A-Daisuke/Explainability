function __method_wrapper__() {
  registerAgent(agentId, metadata = {}) {
    const agent = {
      id: agentId,
      status: 'online',
      lastSeen: Date.now(),
      metadata,
      messageCount: 0,
      channel: this._createChannel(agentId),
    };

    this.state.agents.set(agentId, agent);

    // Announce new agent to swarm
    this.broadcast(
      {
        type: 'agent_joined',
        agentId,
        metadata,
      },
      'sync',
    );

    this.emit('agent:registered', agent);
    return agent;
  }

}
