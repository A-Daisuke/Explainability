function __method_wrapper__() {
  async store(key, value, type = 'knowledge', metadata = {}) {
    try {
      const serialized = JSON.stringify(value);
      const size = Buffer.byteLength(serialized);
      const shouldCompress =
        size > this.config.compressionThreshold && MEMORY_TYPES[type]?.compress;

      let storedValue = serialized;
      let compressed = 0;

      if (shouldCompress) {
        // In production, use proper compression like zlib
        // For now, we'll just mark it as compressed
        compressed = 1;
      }

      const id = `${this.config.swarmId}-${key}-${Date.now()}`;

      // Check if key already exists
      const existing = this.db
        .prepare(
          `
        SELECT id FROM collective_memory 
        WHERE swarm_id = ? AND key = ?
      `,
        )
        .get(this.config.swarmId, key);

      if (existing) {
        // Update existing entry
        this.db
          .prepare(
            `
          UPDATE collective_memory 
          SET value = ?, type = ?, confidence = ?, 
              accessed_at = CURRENT_TIMESTAMP, access_count = access_count + 1,
              compressed = ?, size = ?
          WHERE swarm_id = ? AND key = ?
        `,
          )
          .run(
            storedValue,
            type,
            metadata.confidence || 1.0,
            compressed,
            size,
            this.config.swarmId,
            key,
          );
      } else {
        // Insert new entry
        this.db
          .prepare(
            `
          INSERT INTO collective_memory 
          (id, swarm_id, key, value, type, confidence, created_by, compressed, size)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          )
          .run(
            id,
            this.config.swarmId,
            key,
            storedValue,
            type,
            metadata.confidence || 1.0,
            metadata.createdBy || 'system',
            compressed,
            size,
          );
      }

      // Update cache
      this.cache.set(key, {
        value,
        type,
        timestamp: Date.now(),
        size,
      });

      // Check memory limits
      this._checkMemoryLimits();

      // Track access pattern
      this._trackAccess(key, 'write');

      this.emit('memory:stored', { key, type, size });

      return { success: true, id, size };
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

}
