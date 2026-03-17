function __method_wrapper__() {
  async backup(path: string): Promise<void> {
    const allEntries = await this.db.getAllMemoryEntries();

    const backup = {
      swarmId: this.swarmId,
      timestamp: new Date(),
      entries: allEntries,
      namespaces: Array.from(this.namespaces.values()),
      patterns: await this.learnPatterns(),
    };

    // Store backup using MCP
    await this.mcpWrapper.storeMemory({
      action: 'store',
      key: `backup/${this.swarmId}/${Date.now()}`,
      value: JSON.stringify(backup),
      namespace: 'hive-mind-backups',
    });

    this.emit('memoryBackedUp', { path, entryCount: allEntries.length });
  }

}
