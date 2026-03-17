function __method_wrapper__() {
  private checkCache(request: LLMRequest): LLMResponse | null {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      const age = Date.now() - cached.timestamp.getTime();
      if (age < (this.config.caching?.ttl || 3600) * 1000) {
        return cached.response;
      }
      // Remove expired entry
      this.cache.delete(cacheKey);
    }
    
    return null;
  }

}
