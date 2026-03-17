function __method_wrapper__() {
  getStatistics(): MemoryStatistics {
    const entries = Array.from(this.entries.values());
    const validEntries = entries.filter((e) => !this.isExpired(e));

    const entriesByType: Record<MemoryType, number> = {
      knowledge: 0,
      state: 0,
      cache: 0,
      logs: 0,
      results: 0,
      communication: 0,
      configuration: 0,
      metrics: 0,
    };

    const entriesByAccess: Record<AccessLevel, number> = {
      private: 0,
      team: 0,
      swarm: 0,
      public: 0,
      system: 0,
    };

    let totalSize = 0;
    let oldestEntry = new Date();
    let newestEntry = new Date(0);
    let expiringEntries = 0;

    for (const entry of validEntries) {
      entriesByType[entry.type]++;
      entriesByAccess[entry.accessLevel]++;

      const entrySize = this.calculateEntrySize(entry);
      totalSize += entrySize;

      if (entry.createdAt < oldestEntry) {
        oldestEntry = entry.createdAt;
      }

      if (entry.createdAt > newestEntry) {
        newestEntry = entry.createdAt;
      }

      if (entry.expiresAt && entry.expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000) {
        expiringEntries++;
      }
    }

    return {
      totalEntries: validEntries.length,
      totalSize,
      partitionCount: this.partitions.size,
      entriesByType,
      entriesByAccess,
      averageSize: validEntries.length > 0 ? totalSize / validEntries.length : 0,
      oldestEntry,
      newestEntry,
      expiringEntries,
    };
  }

}
