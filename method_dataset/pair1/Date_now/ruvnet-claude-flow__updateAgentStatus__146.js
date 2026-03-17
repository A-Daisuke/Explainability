class __C__ {
  async updateAgentStatus(agentId, status, metrics = {}) {
    const agent = await this.retrieve(`agent:${agentId}`, { namespace: 'agents' });
    if (!agent) return null;

    agent.status = status;
    agent.lastHeartbeat = Date.now();

    if (metrics) {
      Object.assign(agent.metrics, metrics);
    }

    return this.store(`agent:${agentId}`, agent, {
      namespace: 'agents',
      metadata: { type: 'agent_update' },
    });
  }

}
