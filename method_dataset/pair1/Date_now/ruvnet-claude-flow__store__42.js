class __C__ {
  async store(key, value, options = {}) {
    await this.initialize();

    const namespace = options.namespace || 'default';
    const namespaceMap = this._getNamespaceMap(namespace);

    const now = Date.now();
    const ttl = options.ttl || null;
    const expiresAt = ttl ? now + ttl * 1000 : null;
    const valueStr = typeof value === 'string' ? value : sessionSerializer.serializer.serialize(value);

    const entry = {
      key,
      value: valueStr,
      namespace,
      metadata: options.metadata || null,
      createdAt: namespaceMap.has(key) ? namespaceMap.get(key).createdAt : now,
      updatedAt: now,
      accessedAt: now,
      accessCount: namespaceMap.has(key) ? namespaceMap.get(key).accessCount + 1 : 1,
      ttl,
      expiresAt,
    };

    namespaceMap.set(key, entry);

    return {
      success: true,
      id: `${namespace}:${key}`,
      size: valueStr.length,
    };
  }

}
