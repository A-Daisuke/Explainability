class __C__ {
  async shareMemory(fromAgent, toAgent, keys, options = {}) {
    const shared = [];
    const namespace = options.namespace || 'default';
    
    for (const key of keys) {
      const fullKey = `${namespace}:${key}`;
      const entry = this.memory.get(fullKey);
      
      if (!entry || !entry.shareable) {
        continue;
      }
      
      // Create shared copy
      const sharedKey = `shared:${toAgent}:${key}`;
      await this.store(sharedKey, entry.originalValue || JSON.parse(entry.value), {
        namespace: 'shared',
        agent: toAgent,
        derivedFrom: fullKey,
        tags: [...entry.tags, 'shared', 'from:' + fromAgent],
        ttl: options.ttl || entry.expiresAt ? entry.expiresAt - Date.now() : undefined
      });
      
      shared.push({
        originalKey: fullKey,
        sharedKey: `shared:${sharedKey}`,
        agent: toAgent
      });
    }
    
    this.emit('memory:shared', {
      fromAgent,
      toAgent,
      keys: shared.length
    });
    
    return shared;
  }

}
