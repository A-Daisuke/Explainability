class __C__ {
  _sendHeartbeats() {
    const now = Date.now();

    this.state.agents.forEach((agent, agentId) => {
      // Check if agent is still responsive
      if (now - agent.lastSeen > 30000) {
        agent.status = 'offline';
        this.emit('agent:offline', { agentId });
      }

      // Send heartbeat
      const heartbeat = {
        id: `heartbeat-${now}-${agentId}`,
        from: 'system',
        to: agentId,
        type: 'heartbeat',
        timestamp: now,
        message: { timestamp: now },
        protocol: PROTOCOLS.direct,
      };

      this._addToBuffer(heartbeat);
    });
  }

}
