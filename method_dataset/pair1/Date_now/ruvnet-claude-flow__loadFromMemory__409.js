function __method_wrapper__() {
  private async loadFromMemory(): Promise<void> {
    try {
      const entries = await this.memory.query({
        type: 'state' as const,
        namespace: this.namespace,
      });

      this.cache.clear();
      for (const entry of entries) {
        if (entry.value && entry.value.agent) {
          this.cache.set(entry.value.agent.id.id, entry.value);
        }
      }

      this.lastCacheUpdate = Date.now();
    } catch (error) {
      console.warn('Failed to load agent registry from memory:', error);
    }
  }

}
