class __C__ {
  async retrieve(key, options = {}) {
    const namespace = options.namespace || 'default';
    const fullKey = `${namespace}:${key}`;
    const agent = options.agent || 'system';
    const decompress = options.decompress !== false;
    
    let entry = this.memory.get(fullKey);
    
    if (entry) {
      this.stats.cacheHits++;
    } else {
      this.stats.cacheMisses++;
      
      // Try to load from disk
      entry = await this.loadFromDisk(fullKey);
      if (entry) {
        this.memory.set(fullKey, entry);
      }
    }
    
    if (!entry) {
      return null;
    }
    
    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      await this.delete(key, { namespace });
      return null;
    }
    
    // Update access tracking
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    entry.accessHistory.push({
      agent,
      timestamp: Date.now(),
      operation: 'read'
    });
    
    // Keep recent access history limited
    if (entry.accessHistory.length > 100) {
      entry.accessHistory = entry.accessHistory.slice(-50);
    }
    
    // Update hotness tracking
    this.updateHotness(fullKey, entry);
    
    // Log access pattern
    this.logAccess(fullKey, agent, 'read');
    
    this.emit('retrieved', {
      key: fullKey,
      agent,
      accessCount: entry.accessCount
    });
    
    // Return decompressed value if needed
    if (entry.compressed && decompress) {
      if (entry.originalValue) {
        return entry.originalValue;
      }
      try {
        const decompressed = await this.decompressData(entry.value);
        const parsed = JSON.parse(decompressed);
        entry.originalValue = parsed; // Cache for future access
        return parsed;
      } catch (error) {
        console.error(`Failed to decompress data for key ${fullKey}:`, error);
        return null;
      }
    }
    
    if (entry.originalValue) {
      return entry.originalValue;
    }
    
    try {
      return JSON.parse(entry.value);
    } catch (error) {
      console.error(`Failed to parse data for key ${fullKey}:`, error);
      return null;
    }
  }

}
