function __method_wrapper__() {
  async retrieve(key, options = {}) {
    await this.initialize();

    const namespace = options.namespace || 'default';
    const namespaceMap = this._getNamespaceMap(namespace);

    const entry = namespaceMap.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      namespaceMap.delete(key);
      return null;
    }

    // Update access stats
    entry.accessedAt = Date.now();
    entry.accessCount++;

    // Try to deserialize, fall back to raw string
    try {
      return sessionSerializer.serializer.deserialize(entry.value);
    } catch {
      return entry.value;
    }
  }

}
