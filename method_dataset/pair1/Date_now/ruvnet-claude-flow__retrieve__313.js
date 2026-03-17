class __C__ {
  async retrieve(key, namespace = 'default') {
    this._ensureInitialized();

    const startTime = performance.now();

    try {
      // Check cache first
      const cacheKey = this._getCacheKey(key, namespace);
      const cached = this.cache.get(cacheKey);

      if (cached !== null) {
        this._recordMetric('retrieve_cache', performance.now() - startTime);
        return cached;
      }

      // Get from database
      const row = this.statements.get('select').get(key, namespace);

      if (!row) {
        this._recordMetric('retrieve_miss', performance.now() - startTime);
        return null;
      }

      // Check expiry
      if (row.expires_at && row.expires_at < Math.floor(Date.now() / 1000)) {
        // Delete expired entry
        this.statements.get('delete').run(key, namespace);
        this._recordMetric('retrieve_expired', performance.now() - startTime);
        return null;
      }

      // Update access stats
      this.statements.get('updateAccess').run(key, namespace);

      // Deserialize value
      let value = row.value;
      if (row.type === 'json') {
        value = JSON.parse(value);
      }

      // Update cache
      this.cache.set(cacheKey, value, row.size);

      const duration = performance.now() - startTime;
      this._recordMetric('retrieve_db', duration);

      return value;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

}
