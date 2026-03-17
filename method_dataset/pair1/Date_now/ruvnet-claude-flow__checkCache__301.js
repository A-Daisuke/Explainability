function __method_wrapper__() {
  private checkCache(
    name: string,
    args: Record<string, unknown>
  ): CallToolResult | undefined {
    const cacheKey = this.getCacheKey(name, args);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      const now = Date.now();
      if (now - cached.timestamp < cached.ttl) {
        return {
          content: [
            {
              type: 'text',
              text: typeof cached.result === 'string'
                ? cached.result
                : JSON.stringify(cached.result, null, 2),
            },
          ],
          isError: false,
        };
      } else {
        // Expired, remove from cache
        this.cache.delete(cacheKey);
      }
    }

    return undefined;
  }

}
