function __method_wrapper__() {
  async saveCheckpoint(sessionId, checkpointName, checkpointData) {
    await this.ensureInitialized();
    
    const checkpointId = `checkpoint-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    if (this.isInMemory) {
      // Use in-memory storage
      const checkpointEntry = {
        id: checkpointId,
        session_id: sessionId,
        checkpoint_name: checkpointName,
        checkpoint_data: sessionSerializer.serializeCheckpointData(checkpointData),
        created_at: new Date().toISOString()
      };
      
      if (!this.memoryStore.checkpoints.has(sessionId)) {
        this.memoryStore.checkpoints.set(sessionId, []);
      }
      this.memoryStore.checkpoints.get(sessionId).push(checkpointEntry);
      
      // Update session data
      const session = this.memoryStore.sessions.get(sessionId);
      if (session) {
        session.checkpoint_data = sessionSerializer.serializeCheckpointData(checkpointData);
        session.updated_at = new Date().toISOString();
      }
    } else {
      // Save to database
      const stmt = this.db.prepare(`
        INSERT INTO session_checkpoints (id, session_id, checkpoint_name, checkpoint_data)
        VALUES (?, ?, ?, ?)
      `);

      stmt.run(checkpointId, sessionId, checkpointName, sessionSerializer.serializeCheckpointData(checkpointData));

      // Update session checkpoint data and timestamp
      const updateStmt = this.db.prepare(`
        UPDATE sessions 
        SET checkpoint_data = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      updateStmt.run(sessionSerializer.serializeCheckpointData(checkpointData), sessionId);
    }

    // Save checkpoint file for backup
    const checkpointFile = path.join(this.sessionsDir, `${sessionId}-${checkpointName}.json`);
    await writeFile(
      checkpointFile,
      sessionSerializer.serializeSessionData({
        sessionId,
        checkpointId,
        checkpointName,
        timestamp: new Date().toISOString(),
        data: checkpointData,
      }),
    );

    await this.logSessionEvent(sessionId, 'info', `Checkpoint saved: ${checkpointName}`, null, {
      checkpointId,
    });

    return checkpointId;
  }

}
