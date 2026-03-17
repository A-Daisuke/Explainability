function __method_wrapper__() {
  set(key: K, value: V, ttl?: number): void {
    const now = Date.now();
    const expiry = now + (ttl || this.defaultTTL);

    // Check if we need to evict items due to size limit
    if (this.maxSize && this.items.size >= this.maxSize && !this.items.has(key)) {
      this.evictLRU();
    }

    this.items.set(key, {
      value,
      expiry,
      createdAt: now,
      accessCount: 0,
      lastAccessedAt: now,
    });
  }

}
