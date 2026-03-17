function __method_wrapper__() {
  private async getCachedResult(
    toolName: string,
    input: any,
    context: MCPExecutionContext
  ): Promise<MCPToolExecutionResult | null> {
    const cacheKey = this.generateCacheKey(toolName, input, context);
    const cached = this.executionCache.get(cacheKey);
    
    if (cached) {
      const age = Date.now() - cached.metadata.timestamp.getTime();
      if (age < this.config.cacheTimeout) {
        this.metrics.cacheHits++;
        return cached;
      } else {
        // Remove expired entry
        this.executionCache.delete(cacheKey);
      }
    }

    this.metrics.cacheMisses++;
    return null;
  }

}
