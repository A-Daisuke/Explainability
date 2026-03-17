function __method_wrapper__() {
  async retrieve(
    key: string,
    options: {
      partition?: string;
      consistency?: ConsistencyLevel;
      maxAge?: number;
    } = {},
  ): Promise<MemoryEntry | null> {
    const startTime = Date.now();

    try {
      // Check cache first
      const cached = this.getCachedEntry(key);
      if (cached && this.isCacheValid(cached)) {
        this.recordMetric('retrieve-cache', Date.now() - startTime);
        return cached.entry;
      }

      // Search in specified partition or all partitions
      const partitions = options.partition
        ? [this.partitions.get(options.partition)].filter(Boolean)
        : Array.from(this.partitions.values());

      for (const partition of partitions) {
        const entry = partition!.entries.find((e) => e.key === key);
        if (entry) {
          // Check if entry is expired
          if (entry.expiresAt && entry.expiresAt < new Date()) {
            await this.deleteEntry(entry.id);
            continue;
          }

          // Check access permissions
          if (!this.checkAccess(entry, 'read')) {
            continue;
          }

          // Apply consistency model
          if (this.config.distributed && options.consistency === 'strong') {
            const latestEntry = await this.ensureConsistency(entry);
            this.updateCache(latestEntry.id, latestEntry);
            this.recordMetric('retrieve', Date.now() - startTime);
            return latestEntry;
          }

          this.updateCache(entry.id, entry);
          this.recordMetric('retrieve', Date.now() - startTime);
          return entry;
        }
      }

      // Not found locally, try remote nodes if distributed
      if (this.config.distributed) {
        const remoteEntry = await this.retrieveFromRemote(key, options);
        if (remoteEntry) {
          this.recordMetric('retrieve-remote', Date.now() - startTime);
          return remoteEntry;
        }
      }

      this.recordMetric('retrieve-miss', Date.now() - startTime);
      return null;
    } catch (error) {
      this.recordMetric('retrieve-error', Date.now() - startTime);
      throw error;
    }
  }

}
