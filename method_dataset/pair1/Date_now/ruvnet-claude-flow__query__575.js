function __method_wrapper__() {
  async query(query: MemoryQuery): Promise<MemoryEntry[]> {
    const startTime = Date.now();

    try {
      let results: MemoryEntry[] = [];

      // Get relevant partitions
      const partitions = query.partition
        ? [this.partitions.get(query.partition)].filter(Boolean)
        : Array.from(this.partitions.values());

      for (const partition of partitions) {
        for (const entry of partition!.entries) {
          if (this.matchesQuery(entry, query)) {
            results.push(entry);
          }
        }
      }

      // Apply sorting
      if (query.sortBy) {
        results.sort((a, b) => {
          const aVal = this.getNestedProperty(a, query.sortBy!);
          const bVal = this.getNestedProperty(b, query.sortBy!);
          const order = query.sortOrder === 'desc' ? -1 : 1;

          if (aVal < bVal) return -1 * order;
          if (aVal > bVal) return 1 * order;
          return 0;
        });
      }

      // Apply pagination
      const offset = query.offset || 0;
      const limit = query.limit || results.length;
      results = results.slice(offset, offset + limit);

      this.recordMetric('query', Date.now() - startTime);
      return results;
    } catch (error) {
      this.recordMetric('query-error', Date.now() - startTime);
      throw error;
    }
  }

}
