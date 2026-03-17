function __method_wrapper__() {
  private async evictExpiredEntries(): Promise<void> {
    const now = Date.now();
    const toEvict: string[] = [];

    for (const [cacheKey, entry] of this.cache) {
      if (entry.ttl && entry.createdAt.getTime() + entry.ttl * 1000 < now) {
        toEvict.push(cacheKey);
      }
    }

    for (const key of toEvict) {
      const entry = this.cache.get(key)!;
      await this.delete(entry.key, entry.namespace);
    }
  }

}
