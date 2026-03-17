class __C__ {
  async optimizeWithCache(key, operation, ttl = 300000) {
    // 5 minutes default
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      this.metrics.optimizations.cacheHits++;
      return cached.value;
    }

    const result = await operation();

    this.cache.set(key, {
      value: result,
      timestamp: Date.now(),
    });

    // Clean old cache entries periodically
    if (this.cache.size > 1000) {
      this._cleanCache();
    }

    return result;
  }

}
