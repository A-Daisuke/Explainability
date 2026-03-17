function __method_wrapper__() {
  get(key: K): V | undefined {
    const item = this.items.get(key);

    if (!item) {
      this.stats.misses++;
      return undefined;
    }

    const now = Date.now();

    if (now > item.expiry) {
      this.items.delete(key);
      this.stats.expirations++;
      this.stats.misses++;

      if (this.onExpire) {
        this.onExpire(key, item.value);
      }

      return undefined;
    }

    // Update access stats
    item.accessCount++;
    item.lastAccessedAt = now;
    this.stats.hits++;

    return item.value;
  }

}
