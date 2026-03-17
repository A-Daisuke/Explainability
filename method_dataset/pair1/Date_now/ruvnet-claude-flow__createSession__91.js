function __method_wrapper__() {
  async createSession(profile: AgentProfile): Promise<AgentSession> {
    try {
      // Create terminal with retry logic
      const terminalId = await retry(() => this.terminalManager.spawnTerminal(profile), {
        maxAttempts: 3,
        initialDelay: 1000,
      });

      // Create memory bank with retry logic
      const memoryBankId = await retry(() => this.memoryManager.createBank(profile.id), {
        maxAttempts: 3,
        initialDelay: 1000,
      });

      // Create session
      const session: AgentSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentId: profile.id,
        terminalId,
        startTime: new Date(),
        status: 'active',
        lastActivity: new Date(),
        memoryBankId,
      };

      this.sessions.set(session.id, session);
      this.sessionProfiles.set(session.id, profile);

      this.logger.info('Session created', {
        sessionId: session.id,
        agentId: profile.id,
        terminalId,
        memoryBankId,
      });

      // Persist sessions asynchronously
      this.persistSessions().catch((error) =>
        this.logger.error('Failed to persist sessions', error),
      );

      return session;
    } catch (error) {
      this.logger.error('Failed to create session', { agentId: profile.id, error });
      throw new SystemError(`Failed to create session for agent ${profile.id}`, { error });
    }
  }

}
