function __method_wrapper__() {
  _trackAccess(key, operation) {
    const pattern = this.state.accessPatterns.get(key) || {
      reads: 0,
      writes: 0,
      searches: 0,
      cacheHits: 0,
      misses: 0,
      lastAccess: Date.now(),
    };

    switch (operation) {
      case 'read':
        pattern.reads++;
        break;
      case 'write':
        pattern.writes++;
        break;
      case 'search':
        pattern.searches++;
        break;
      case 'cache_hit':
        pattern.cacheHits++;
        break;
      case 'miss':
        pattern.misses++;
        break;
    }

    pattern.lastAccess = Date.now();
    this.state.accessPatterns.set(key, pattern);

    // Keep access patterns size limited
    if (this.state.accessPatterns.size > 1000) {
      // Remove oldest entries
      const sorted = Array.from(this.state.accessPatterns.entries()).sort(
        (a, b) => a[1].lastAccess - b[1].lastAccess,
      );

      sorted.slice(0, 100).forEach(([key]) => {
        this.state.accessPatterns.delete(key);
      });
    }
  }

}
