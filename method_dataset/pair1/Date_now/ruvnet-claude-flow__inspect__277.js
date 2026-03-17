function __method_wrapper__() {
  inspect(): Map<
    K,
    {
      value: V;
      ttl: number;
      age: number;
      accessCount: number;
      lastAccessed: number;
    }
  > {
    const now = Date.now();
    const result = new Map();

    for (const [key, item] of this.items) {
      if (now <= item.expiry) {
        result.set(key, {
          value: item.value,
          ttl: item.expiry - now,
          age: now - item.createdAt,
          accessCount: item.accessCount,
          lastAccessed: now - item.lastAccessedAt,
        });
      }
    }

    return result;
  }

}
