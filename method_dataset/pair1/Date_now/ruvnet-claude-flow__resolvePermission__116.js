function __method_wrapper__() {
  async resolvePermission(query: PermissionQuery): Promise<PermissionResolution> {
    const startTime = Date.now();

    // Check cache
    if (this.cacheEnabled) {
      const cacheKey = this.generateCacheKey(query);
      const cached = this.cache.get(cacheKey);

      if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
        return {
          ...cached.resolution,
          cached: true,
          resolutionTime: Date.now() - startTime,
        };
      }
    }

    // Resolve using fallback chain: SESSION → LOCAL → PROJECT → USER
    const fallbackChain: PermissionLevel[] = ['session', 'local', 'project', 'user'];

    for (const level of fallbackChain) {
      const rule = this.findRule(query, level);

      if (rule) {
        const resolution: PermissionResolution = {
          behavior: rule.behavior,
          level,
          rule,
          fallbackChain: fallbackChain.slice(0, fallbackChain.indexOf(level) + 1),
          cached: false,
          resolutionTime: Date.now() - startTime,
        };

        // Cache result
        if (this.cacheEnabled) {
          this.cache.set(this.generateCacheKey(query), {
            resolution,
            timestamp: Date.now(),
          });
        }

        return resolution;
      }
    }

    // No rule found, use default 'ask' behavior
    return {
      behavior: 'ask',
      level: 'session',
      fallbackChain,
      cached: false,
      resolutionTime: Date.now() - startTime,
    };
  }

}
