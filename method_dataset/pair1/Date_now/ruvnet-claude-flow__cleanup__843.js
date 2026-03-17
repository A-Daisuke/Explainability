class __C__ {
  async cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.memory) {
      // Remove expired entries
      if (entry.expiresAt && now > entry.expiresAt) {
        await this.delete(key.split(':')[1], { namespace: entry.namespace });
        cleaned++;
        continue;
      }
      
      // Remove old, rarely accessed entries if memory is full
      if (this.memory.size > this.config.maxCacheSize * 0.9) {
        const daysSinceAccess = (now - entry.lastAccessed) / 86400000;
        if (daysSinceAccess > 7 && entry.accessCount < 2) {
          await this.delete(key.split(':')[1], { namespace: entry.namespace });
          cleaned++;
        }
      }
    }
    
    this.stats.lastCleanup = now;
    
    if (cleaned > 0) {
      this.emit('cleanup:completed', { entriesRemoved: cleaned });
    }
  }

}
