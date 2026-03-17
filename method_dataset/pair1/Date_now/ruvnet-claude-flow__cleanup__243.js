function __method_wrapper__() {
  private cleanup(): void {
    const now = Date.now();

    // Clean up old messages
    for (const [agentId, queue] of this.queues) {
      const filtered = queue.messages.filter((msg) => {
        const age = now - msg.timestamp.getTime();
        const maxAge = msg.expiry
          ? msg.expiry.getTime() - msg.timestamp.getTime()
          : this.config.messageTimeout;

        if (age > maxAge) {
          this.logger.warn('Dropping expired message', {
            agentId,
            messageId: msg.id,
            age,
          });
          return false;
        }
        return true;
      });

      queue.messages = filtered;

      // Remove empty queues
      if (queue.messages.length === 0 && queue.handlers.size === 0) {
        this.queues.delete(agentId);
      }
    }

    // Clean up timed out responses
    for (const [id, pending] of this.pendingResponses) {
      // This is handled by the timeout, but double-check
      clearTimeout(pending.timeout);
      pending.reject(new Error('Response timeout during cleanup'));
    }
    this.pendingResponses.clear();
  }

}
