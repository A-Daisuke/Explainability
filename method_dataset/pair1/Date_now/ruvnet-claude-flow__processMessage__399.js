function __method_wrapper__() {
  private async processMessage(message: Message): Promise<void> {
    const startTime = Date.now();

    try {
      if (message.toAgentId) {
        // Direct message
        const agent = this.agents.get(message.toAgentId);
        if (agent) {
          await agent.receiveMessage(message);
          await this.markDelivered(message.id);
        }
      } else {
        // Broadcast message
        for (const agent of this.agents.values()) {
          if (agent.id !== message.fromAgentId) {
            await agent.receiveMessage(message);
          }
        }
      }

      // Update latency stats
      const latency = Date.now() - startTime;
      this.updateLatencyStats(latency);

      this.emit('messageProcessed', { message, latency });
    } catch (error) {
      this.emit('messageError', { message, error });
    }
  }

}
