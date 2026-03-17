function __method_wrapper__() {
  private async spawnSingleAgent(
    config: ParallelAgentConfig,
    options: SessionForkOptions,
    executionId: string
  ): Promise<any> {
    const sessionId = generateId('fork-session');
    const startTime = Date.now();

    this.logger.debug('Spawning forked session', {
      sessionId,
      agentId: config.agentId,
      agentType: config.agentType
    });

    try {
      // Create forked session with SDK
      const sdkOptions: Options = {
        forkSession: true, // KEY FEATURE: Enable session forking
        resume: options.baseSessionId, // Resume from base session if provided
        resumeSessionAt: options.resumeFromMessage, // Resume from specific message
        model: options.model || 'claude-sonnet-4',
        maxTurns: 50,
        timeout: config.timeout || options.timeout || 60000,
        mcpServers: options.mcpServers || {},
        cwd: process.cwd()
      };

      // Build agent prompt
      const prompt = this.buildAgentPrompt(config);

      // Create forked query
      const forkedQuery = query({
        prompt,
        options: sdkOptions
      });

      // Track forked session
      const forkedSession: ForkedSession = {
        sessionId,
        agentId: config.agentId,
        agentType: config.agentType,
        query: forkedQuery,
        messages: [],
        status: 'spawning',
        startTime
      };

      this.activeSessions.set(sessionId, forkedSession);
      this.emit('session:forked', { sessionId, agentId: config.agentId });

      // Collect messages from forked session
      const messages: SDKMessage[] = [];
      let outputText = '';

      for await (const message of forkedQuery) {
        messages.push(message);
        forkedSession.messages.push(message);

        // Extract output text from assistant messages
        if (message.type === 'assistant') {
          const textContent = message.message.content
            .filter((c: any) => c.type === 'text')
            .map((c: any) => c.text)
            .join('\n');
          outputText += textContent;
        }

        // Update session status
        forkedSession.status = 'active';
        this.emit('session:message', { sessionId, message });
      }

      // Mark as completed
      forkedSession.status = 'completed';
      forkedSession.endTime = Date.now();

      // Store session history
      this.sessionHistory.set(sessionId, messages);

      const duration = Date.now() - startTime;

      this.logger.debug('Forked session completed', {
        sessionId,
        agentId: config.agentId,
        duration,
        messageCount: messages.length
      });

      return {
        agentId: config.agentId,
        output: outputText,
        messages,
        duration,
        status: 'completed'
      };

    } catch (error) {
      this.logger.error('Forked session failed', {
        sessionId,
        agentId: config.agentId,
        error: error instanceof Error ? error.message : String(error)
      });

      const session = this.activeSessions.get(sessionId);
      if (session) {
        session.status = 'failed';
        session.error = error as Error;
        session.endTime = Date.now();
      }

      throw error;
    }
  }

}
