class __C__ {
  async store(key, value, options = {}) {
    await this.initialize();

    const namespace = options.namespace || 'default';
    const metadata = options.metadata ? JSON.stringify(options.metadata) : null;
    const ttl = options.ttl || null;
    const expiresAt = ttl ? Math.floor(Date.now() / 1000) + ttl : null;
    const valueStr = typeof value === 'string' ? value : sessionSerializer.serializer.serialize(value);

    try {
      const result = this.statements
        .get('upsert')
        .run(key, valueStr, namespace, metadata, ttl, expiresAt);

      return {
        success: true,
        id: result.lastInsertRowid,
        size: valueStr.length,
      };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ERROR [memory-store] Store failed:`, error);
      throw error;
    }
  }

}
