class __C__ {
  set(key, data, size = 0) {
    // Estimate size if not provided
    if (!size) {
      size = this._estimateSize(data);
    }

    // Handle memory pressure
    while (this.currentMemory + size > this.maxMemory && this.cache.size > 0) {
      this._evictLRU();
    }

    // Handle size limit
    while (this.cache.size >= this.maxSize) {
      this._evictLRU();
    }

    this.cache.set(key, { data, size, timestamp: Date.now() });
    this.currentMemory += size;
  }

}
