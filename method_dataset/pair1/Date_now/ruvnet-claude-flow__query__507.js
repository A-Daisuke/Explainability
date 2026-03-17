function __method_wrapper__() {
  async query(options: QueryOptions = {}): Promise<{
    entries: MemoryEntry[];
    total: number;
    aggregations?: Record<string, any>;
  }> {
    const startTime = Date.now();

    try {
      let candidateEntries: MemoryEntry[] = [];

      // Use index for efficient querying if enabled
      if (this.config.indexingEnabled) {
        candidateEntries = this.queryWithIndex(options);
      } else {
        candidateEntries = Array.from(this.entries.values());
      }

      // Apply filters
      let filteredEntries = candidateEntries.filter((entry) => {
        return this.matchesQuery(entry, options);
      });

      // Remove expired entries
      if (!options.includeExpired) {
        filteredEntries = filteredEntries.filter((entry) => {
          if (entry.expiresAt && entry.expiresAt < new Date()) {
            // Schedule for deletion
            setTimeout(() => this.deleteEntry(entry.id), 0);
            return false;
          }
          return true;
        });
      }

      const total = filteredEntries.length;

      // Apply sorting
      if (options.sortBy) {
        filteredEntries.sort((a, b) => {
          const aVal = this.getPropertyValue(a, options.sortBy!);
          const bVal = this.getPropertyValue(b, options.sortBy!);
          const multiplier = options.sortOrder === 'desc' ? -1 : 1;

          if (aVal < bVal) return -1 * multiplier;
          if (aVal > bVal) return 1 * multiplier;
          return 0;
        });
      }

      // Apply pagination
      const offset = options.offset || 0;
      const limit = options.limit || filteredEntries.length;
      const paginatedEntries = filteredEntries.slice(offset, offset + limit);

      // Update last accessed times
      paginatedEntries.forEach((entry) => {
        entry.lastAccessedAt = new Date();
      });

      // Generate aggregations if requested
      let aggregations: Record<string, any> | undefined;
      if (options.aggregateBy) {
        aggregations = this.generateAggregations(filteredEntries, options.aggregateBy);
      }

      this.recordMetric('query', Date.now() - startTime);

      return {
        entries: paginatedEntries,
        total,
        aggregations,
      };
    } catch (error) {
      this.recordMetric('query-error', Date.now() - startTime);
      throw error;
    }
  }

}
