function __method_wrapper__() {
  async retrieve(
    key: string,
    options: {
      namespace?: string;
      updateLastAccessed?: boolean;
    } = {},
  ): Promise<MemoryEntry | null> {
    const startTime = Date.now();

    try {
      // Check cache first
      const cached = this.cache.get(key);
      if (cached && cached.expiry > Date.now()) {
        this.recordMetric('retrieve-cache', Date.now() - startTime);
        return cached.entry;
      }

      // Search in entries
      const entry = this.findEntryByKey(key, options.namespace);
      if (!entry) {
        this.recordMetric('retrieve-miss', Date.now() - startTime);
        return null;
      }

      // Check if expired
      if (entry.expiresAt && entry.expiresAt < new Date()) {
        await this.deleteEntry(entry.id);
        this.recordMetric('retrieve-expired', Date.now() - startTime);
        return null;
      }

      // Update last accessed
      if (options.updateLastAccessed !== false) {
        entry.lastAccessedAt = new Date();
      }

      // Decompress if needed
      if (entry.compressed) {
        entry.value = await this.decompressValue(entry.value);
      }

      // Update cache
      this.updateCache(key, entry);

      this.recordMetric('retrieve', Date.now() - startTime);
      return entry;
    } catch (error) {
      this.recordMetric('retrieve-error', Date.now() - startTime);
      throw error;
    }
  }

}
