function __method_wrapper__() {
  async createSession(swarmId, swarmName, objective, metadata = {}) {
    await this.ensureInitialized();
    
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    if (this.isInMemory) {
      // Use in-memory storage
      const sessionData = {
        id: sessionId,
        swarm_id: swarmId,
        swarm_name: swarmName,
        objective,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: sessionSerializer.serializeMetadata(metadata),
        parent_pid: process.pid,
        child_pids: '[]'
      };
      this.memoryStore.sessions.set(sessionId, sessionData);
    } else {
      // Use SQLite
      const stmt = this.db.prepare(`
        INSERT INTO sessions (id, swarm_id, swarm_name, objective, metadata, parent_pid)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(sessionId, swarmId, swarmName, objective, sessionSerializer.serializeMetadata(metadata), process.pid);
    }

    // Log session creation
    await this.logSessionEvent(sessionId, 'info', 'Session created', null, {
      swarmId,
      swarmName,
      objective,
      parentPid: process.pid,
    });

    return sessionId;
  }

}
