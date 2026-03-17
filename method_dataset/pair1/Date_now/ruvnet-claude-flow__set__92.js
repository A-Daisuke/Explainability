function __method_wrapper__() {
  set(key, data) {
    const size = this._estimateSize(data);

    // Check memory pressure
    if (this.currentMemory + size > this.maxMemory) {
      this._evictByMemoryPressure(size);
    }

    // Check size limit
    if (this.cache.size >= this.maxSize) {
      this._evictLRU();
    }

    const entry = {
      data,
      size,
      timestamp: Date.now(),
    };

    this.cache.set(key, entry);
    this.currentMemory += size;
  }

}
