function __method_wrapper__() {
  async createCheckpoint(sessionId: string, description: string): Promise<string> {
    const messages = this.sessionMessages.get(sessionId);

    if (!messages || messages.length === 0) {
      throw new Error(`No messages tracked for session: ${sessionId}`);
    }

    const lastMessage = messages[messages.length - 1];
    const checkpointId = lastMessage.uuid; // ✅ Checkpoint = message UUID!

    // Calculate stats
    const totalTokens = this.calculateTotalTokens(messages);
    const filesModified = this.extractFilesModified(messages);

    const checkpoint: Checkpoint = {
      id: checkpointId,
      sessionId,
      description,
      timestamp: Date.now(),
      messageCount: messages.length,
      totalTokens,
      filesModified,
    };

    this.checkpoints.set(checkpointId, checkpoint);
    await this.persistCheckpoint(checkpoint);

    // Enforce max checkpoints limit
    await this.enforceCheckpointLimit(sessionId);

    this.emit('checkpoint:created', {
      checkpointId,
      sessionId,
      description,
      messageCount: messages.length,
    });

    return checkpointId;
  }

}
