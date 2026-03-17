function __method_wrapper__() {
  async createMessage(params: Anthropic.MessageCreateParams): Promise<Anthropic.Message> {
    try {
      // SDK handles retry automatically based on configuration
      const message = await this.sdk.messages.create(params);

      // Store in swarm metadata if in swarm mode
      if (this.config.swarmMode && message.id) {
        this.swarmMetadata.set(message.id, {
          timestamp: Date.now(),
          model: params.model,
          tokensUsed: message.usage
        });
      }

      return message;
    } catch (error) {
      // Enhanced error handling for swarm mode
      if (this.config.swarmMode) {
        console.error('[SDK] Message creation failed in swarm mode:', error);
        this.logSwarmError(error);
      }
      throw error;
    }
  }

}
