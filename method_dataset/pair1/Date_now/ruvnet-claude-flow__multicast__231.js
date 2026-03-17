function __method_wrapper__() {
  multicast(agentIds, message, type = 'query') {
    const messageId = this._generateMessageId();
    const timestamp = Date.now();

    const envelopes = agentIds.map((agentId) => ({
      id: `${messageId}-${agentId}`,
      from: 'system',
      to: agentId,
      type,
      timestamp,
      message,
      protocol: PROTOCOLS.multicast,
      groupId: messageId,
    }));

    envelopes.forEach((envelope) => this._addToBuffer(envelope));

    this.state.metrics.sent += envelopes.length;

    return { messageId, recipients: agentIds.length };
  }

}
