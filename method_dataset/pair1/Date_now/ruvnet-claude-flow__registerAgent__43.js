function __method_wrapper__() {
  registerAgent(agentId, initialWeight = 1.0, capabilities = []) {
    this.agents.set(agentId, {
      id: agentId,
      weight: initialWeight,
      reputation: 1.0,
      capabilities,
      votescast: 0,
      correctVotes: 0,
      byzantineFlags: 0,
      lastActivity: Date.now(),
      isOnline: true
    });
    
    this.emit('agent:registered', { agentId, weight: initialWeight });
  }

}
