class __C__ {
  gossip(message, type = 'sync') {
    const messageId = this._generateMessageId();
    const timestamp = Date.now();

    // Select random agents for initial spread
    const agents = Array.from(this.state.agents.keys());
    const selected = this._selectRandomAgents(agents, this.config.gossipFanout);

    selected.forEach((agentId) => {
      const envelope = {
        id: `${messageId}-${agentId}`,
        from: 'system',
        to: agentId,
        type,
        timestamp,
        message: {
          ...message,
          _gossip: {
            originalId: messageId,
            hops: 0,
            seen: [],
          },
        },
        protocol: PROTOCOLS.gossip,
      };

      this._addToBuffer(envelope);
    });

    this.state.metrics.sent += selected.length;

    return { messageId, initialTargets: selected };
  }

}
