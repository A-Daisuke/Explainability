function __method_wrapper__() {
  async terminateSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    this.logger.info('Terminating hive-mind session', {
      sessionId,
      participantCount: session.participants.length,
      duration: Date.now() - session.startTime.getTime(),
    });

    // Save session knowledge to global knowledge base
    await this.consolidateSessionKnowledge(session);

    // Update status and cleanup
    session.status = 'terminated';
    this.activeSessions.delete(sessionId);

    this.emit('session:terminated', {
      sessionId,
      duration: Date.now() - session.startTime.getTime(),
    });
  }

}
