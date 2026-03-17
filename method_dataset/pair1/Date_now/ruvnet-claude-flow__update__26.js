function __method_wrapper__() {
  update(key, newValue) {
    const existing = this.data.get(key);
    if (!existing) throw new Error('Key not found');
    
    existing.history.push({
      value: existing.value,
      version: existing.version,
      timestamp: existing.updatedAt
    });
    
    existing.value = newValue;
    existing.version++;
    existing.updatedAt = Date.now();
    
    // Keep only last 10 versions
    if (existing.history.length > 10) {
      existing.history.shift();
    }
    
    return existing;
  }

}
