class __C__ {
  async search(pattern, options = {}) {
    await this.initialize();

    const namespace = options.namespace || 'default';
    const limit = options.limit || 50;
    const namespaceMap = this._getNamespaceMap(namespace);

    const searchLower = pattern.toLowerCase();
    const results = [];

    for (const [key, entry] of namespaceMap.entries()) {
      // Skip expired entries
      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        continue;
      }

      // Search in key and value
      if (
        key.toLowerCase().includes(searchLower) ||
        entry.value.toLowerCase().includes(searchLower)
      ) {
        results.push({
          key: entry.key,
          value: this._tryParseJson(entry.value),
          namespace: entry.namespace,
          score: entry.accessCount,
          updatedAt: new Date(entry.updatedAt),
        });
      }

      if (results.length >= limit) {
        break;
      }
    }

    // Sort by score (access count) and updated time
    return results.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return b.updatedAt - a.updatedAt;
    });
  }

}
