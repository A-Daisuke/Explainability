function __method_wrapper__() {
  async send(toAgentId, message, type = 'query') {
    const messageId = this._generateMessageId();
    const timestamp = Date.now();

    const envelope = {
      id: messageId,
      from: 'system', // Will be set by sender
      to: toAgentId,
      type,
      timestamp,
      message,
      protocol: PROTOCOLS.direct,
    };

    // Encrypt if needed
    if (this.config.encryption && MESSAGE_TYPES[type]?.encrypted) {
      envelope.message = this._encrypt(message);
      envelope.encrypted = true;
      this.state.metrics.encrypted++;
    }

    // Add to buffer
    this._addToBuffer(envelope);

    // Track message
    this.state.messageHistory.set(messageId, {
      ...envelope,
      status: 'pending',
      attempts: 0,
    });

    this.state.metrics.sent++;

    // Return promise that resolves when message is acknowledged
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Message timeout: ${messageId}`));
      }, this.config.timeout);

      this.once(`ack:${messageId}`, () => {
        clearTimeout(timeout);
        resolve({ messageId, delivered: true });
      });

      this.once(`nack:${messageId}`, (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

}
