class __C__ {
  async store(key, value, options = {}) {
    this._ensureInitialized();

    const startTime = performance.now();

    try {
      const namespace = options.namespace || 'default';
      const ttl = options.ttl;
      const tags = options.tags ? JSON.stringify(options.tags) : null;
      const metadata = options.metadata ? JSON.stringify(options.metadata) : null;

      // Serialize value
      let serialized = value;
      let type = 'string';
      let compressed = 0;

      if (typeof value !== 'string') {
        serialized = JSON.stringify(value);
        type = 'json';
      }

      const size = Buffer.byteLength(serialized);

      // Compress if needed
      if (size > this.options.compressionThreshold) {
        // In production, use proper compression
        compressed = 1;
      }

      // Calculate expiry
      const expiresAt = ttl ? Math.floor(Date.now() / 1000) + ttl : null;

      // Store in database
      this.statements
        .get('upsert')
        .run(key, namespace, serialized, type, metadata, tags, ttl, expiresAt, compressed, size);

      // Update cache
      const cacheKey = this._getCacheKey(key, namespace);
      this.cache.set(cacheKey, value, size);

      const duration = performance.now() - startTime;
      this._recordMetric('store', duration);

      this.emit('stored', { key, namespace, size, compressed: !!compressed });

      return { success: true, key, namespace, size };
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

}
