function __method_wrapper__() {
  async storeMemory(swarmId, key, value, type = 'knowledge') {
    try {
      // Don't reinitialize if we already have storage
      if (!this.memoryDb && !this.memoryStore) {
        await this.initializeMemoryStorage();
      }

      const timestamp = Date.now();
      const valueStr = typeof value === 'string' ? value : JSON.stringify(value);

      if (this.memoryDb) {
        // SQLite storage
        const stmt = this.memoryDb.prepare(`
          INSERT OR REPLACE INTO memories (namespace, key, value, type, timestamp)
          VALUES (?, ?, ?, ?, ?)
        `);

        const result = stmt.run(swarmId, key, valueStr, type, timestamp);

        return {
          success: true,
          action: 'store',
          namespace: swarmId,
          key,
          type,
          timestamp,
          id: result.lastInsertRowid,
        };
      } else {
        // Fallback in-memory storage
        const memoryKey = `${swarmId}:${key}`;
        this.memoryStore.set(memoryKey, {
          namespace: swarmId,
          key,
          value: valueStr,
          type,
          timestamp,
        });

        return {
          success: true,
          action: 'store',
          namespace: swarmId,
          key,
          type,
          timestamp,
        };
      }
    } catch (error) {
      console.error('Error storing memory:', error);
      throw error;
    }
  }

}
