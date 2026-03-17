class __C__ {
  async logSessionEvent(sessionId, logLevel, message, agentId = null, data = null) {
    await this.ensureInitialized();
    
    if (this.isInMemory) {
      // Use in-memory storage for logs
      const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      const logEntry = {
        id: logId,
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        log_level: logLevel,
        message,
        agent_id: agentId,
        data: data ? sessionSerializer.serializeLogData(data) : null
      };
      
      if (!this.memoryStore.logs.has(sessionId)) {
        this.memoryStore.logs.set(sessionId, []);
      }
      this.memoryStore.logs.get(sessionId).push(logEntry);
    } else {
      // Use SQLite
      const stmt = this.db.prepare(`
        INSERT INTO session_logs (session_id, log_level, message, agent_id, data)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run(sessionId, logLevel, message, agentId, data ? sessionSerializer.serializeLogData(data) : null);
    }
  }

}
