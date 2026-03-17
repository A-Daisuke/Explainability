class __C__ {
  async store(key, value, options = {}) {
    if (!this.initialized) {
      throw new Error('Memory system not initialized');
    }

    const namespace = options.namespace || 'default';
    const ttl = options.ttl || this.config.defaultTTL;
    const agent = options.agent || 'system';
    const tags = options.tags || [];
    const priority = options.priority || 'normal';
    const compression = options.compression !== false && this.config.enableCompression;
    
    const fullKey = `${namespace}:${key}`;
    const serializedValue = JSON.stringify(value);
    const originalSize = Buffer.byteLength(serializedValue, 'utf8');
    
    let storedValue = serializedValue;
    let compressed = false;
    let compressionRatio = 1;
    
    // Apply compression if beneficial
    if (compression && originalSize > this.config.compressionThreshold) {
      const compressedValue = await this.compressData(serializedValue);
      if (compressedValue.length < originalSize * 0.8) {
        storedValue = compressedValue;
        compressed = true;
        compressionRatio = originalSize / compressedValue.length;
        this.stats.compressionSaved += originalSize - compressedValue.length;
      }
    }
    
    const entry = {
      key: fullKey,
      value: storedValue,
      originalValue: value, // Keep uncompressed for cache
      size: Buffer.byteLength(storedValue, 'utf8'),
      originalSize,
      compressed,
      compressionRatio,
      namespace,
      agent,
      tags: new Set(tags),
      priority,
      
      // Metadata
      createdAt: Date.now(),
      updatedAt: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : null,
      version: 1,
      
      // Access tracking
      accessCount: 0,
      lastAccessed: Date.now(),
      accessHistory: [],
      
      // Relationships
      relationships: new Set(),
      derivedFrom: options.derivedFrom ? new Set([options.derivedFrom]) : new Set(),
      
      // Flags
      persistent: options.persistent !== false,
      shareable: options.shareable !== false,
      cacheable: options.cacheable !== false
    };
    
    // Update existing entry or create new
    const existingEntry = this.memory.get(fullKey);
    if (existingEntry) {
      entry.version = existingEntry.version + 1;
      entry.createdAt = existingEntry.createdAt;
      entry.accessCount = existingEntry.accessCount;
      entry.accessHistory = existingEntry.accessHistory;
      entry.relationships = existingEntry.relationships;
    }
    
    // Store in memory
    this.memory.set(fullKey, entry);
    this.updateIndex(fullKey, entry);
    this.updateShard(fullKey, entry);
    
    // Update statistics
    this.stats.totalKeys = this.memory.size;
    this.stats.totalSize += entry.size;
    if (existingEntry) {
      this.stats.totalSize -= existingEntry.size;
    }
    
    // Mark as dirty for persistence
    this.isDirty = true;
    this.queueForPersistence(entry);
    
    // Detect patterns if enabled
    if (this.config.enablePatternDetection) {
      this.detectPatterns(entry);
    }
    
    // Update relationships
    this.updateRelationships(fullKey, entry);
    
    this.emit('stored', {
      key: fullKey,
      size: entry.size,
      compressed,
      agent,
      namespace
    });
    
    // Cleanup if memory is getting full
    if (this.memory.size > this.config.maxCacheSize) {
      await this.cleanup();
    }
    
    return fullKey;
  }

}
