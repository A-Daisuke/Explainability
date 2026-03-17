class __C__ {
  async retrieve(key) {
    try {
      // Check cache first
      if (this.cache.has(key)) {
        const cached = this.cache.get(key);
        this._trackAccess(key, 'cache_hit');
        return cached.value;
      }

      // Query database
      const result = this.db
        .prepare(
          `
        SELECT value, type, compressed, confidence
        FROM collective_memory
        WHERE swarm_id = ? AND key = ?
      `,
        )
        .get(this.config.swarmId, key);

      if (!result) {
        this._trackAccess(key, 'miss');
        return null;
      }

      // Update access statistics
      this.db
        .prepare(
          `
        UPDATE collective_memory
        SET accessed_at = CURRENT_TIMESTAMP,
            access_count = access_count + 1
        WHERE swarm_id = ? AND key = ?
      `,
        )
        .run(this.config.swarmId, key);

      // Decompress if needed
      let value = result.value;
      if (result.compressed) {
        // In production, decompress here
      }

      // Parse JSON
      const parsed = JSON.parse(value);

      // Add to cache
      this.cache.set(key, {
        value: parsed,
        type: result.type,
        timestamp: Date.now(),
        confidence: result.confidence,
      });

      this._trackAccess(key, 'read');

      return parsed;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

}
