class __C__ {
  broadcast(message, type = 'broadcast') {
    const messageId = this._generateMessageId();
    const timestamp = Date.now();

    const envelope = {
      id: messageId,
      from: 'system',
      to: '*',
      type,
      timestamp,
      message,
      protocol: PROTOCOLS.broadcast,
    };

    // Broadcasts are typically not encrypted
    this._addToBuffer(envelope);

    this.state.metrics.sent++;

    this.emit('message:broadcast', envelope);

    return { messageId, recipients: this.state.agents.size };
  }

}
