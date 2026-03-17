function __method_wrapper__() {
  set(id: string, data: MemoryEntry, dirty = true): void {
    const size = this.calculateSize(data);

    // Check if we need to evict entries
    if (this.currentSize + size > this.maxSize) {
      this.evict(size);
    }

    const entry: CacheEntry = {
      data,
      size,
      lastAccessed: Date.now(),
      dirty,
    };

    // Update size if replacing existing entry
    const existing = this.cache.get(id);
    if (existing) {
      this.currentSize -= existing.size;
    }

    this.cache.set(id, entry);
    this.currentSize += size;
  }

}
