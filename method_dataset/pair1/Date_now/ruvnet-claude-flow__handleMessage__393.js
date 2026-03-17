class __C__ {
  handleMessage(envelope) {
    this.state.metrics.received++;

    // Update agent last seen
    const agent = this.state.agents.get(envelope.from);
    if (agent) {
      agent.lastSeen = Date.now();
      agent.messageCount++;
    }

    // Decrypt if needed
    if (envelope.encrypted && this.config.encryption) {
      try {
        envelope.message = this._decrypt(envelope.message);
      } catch (error) {
        this.emit('error', { type: 'decryption_failed', envelope, error });
        return;
      }
    }

    // Process based on protocol
    switch (envelope.protocol) {
      case PROTOCOLS.direct:
        this._handleDirectMessage(envelope);
        break;

      case PROTOCOLS.broadcast:
        this._handleBroadcastMessage(envelope);
        break;

      case PROTOCOLS.multicast:
        this._handleMulticastMessage(envelope);
        break;

      case PROTOCOLS.gossip:
        this._handleGossipMessage(envelope);
        break;

      case PROTOCOLS.consensus:
        this._handleConsensusMessage(envelope);
        break;

      default:
        this.emit('error', { type: 'unknown_protocol', envelope });
    }

    // Emit general message event
    this.emit('message:received', envelope);
  }

}
