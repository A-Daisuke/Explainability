class __C__ {
  _garbageCollect() {
    try {
      const now = Date.now();
      let deletedCount = 0;

      // Delete expired memories based on TTL
      Object.entries(MEMORY_TYPES).forEach(([type, config]) => {
        if (config.ttl) {
          const result = this.db
            .prepare(
              `
            DELETE FROM collective_memory
            WHERE swarm_id = ?
            AND type = ?
            AND (julianday('now') - julianday(accessed_at)) * 86400000 > ?
          `,
            )
            .run(this.config.swarmId, type, config.ttl);

          deletedCount += result.changes;
        }
      });

      // Clear old cache entries
      const cacheTimeout = 300000; // 5 minutes
      this.cache.forEach((value, key) => {
        if (now - value.timestamp > cacheTimeout) {
          this.cache.delete(key);
        }
      });

      // Update statistics
      this._updateStatistics();

      this.state.lastGC = now;

      if (deletedCount > 0) {
        this.emit('memory:gc', { deleted: deletedCount, cacheSize: this.cache.size });
      }
    } catch (error) {
      this.emit('error', error);
    }
  }

}
