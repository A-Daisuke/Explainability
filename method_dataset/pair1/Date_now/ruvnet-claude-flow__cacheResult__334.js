function __method_wrapper__() {
  private cacheResult(name: string, args: Record<string, unknown>, result: any): void {
    const cacheKey = this.getCacheKey(name, args);
    const ttl = this.getCacheTTL(name);

    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now(),
      ttl,
    });

    // Limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

}
