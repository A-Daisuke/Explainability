function __method_wrapper__() {
  async saveToDisk() {
    if (!this.isDirty && this.persistenceQueue.length === 0) {
      return;
    }
    
    try {
      // Process persistence queue
      for (const item of this.persistenceQueue) {
        if (item.action === 'store') {
          const filename = path.join(
            this.config.persistenceDir,
            `${item.entry.namespace}_${this.hashKey(item.entry.key) % 100}.json`
          );
          
          let data = {};
          try {
            const existing = await fs.readFile(filename, 'utf8');
            data = JSON.parse(existing);
          } catch (error) {
            // File doesn't exist, start with empty object
          }
          
          data[item.entry.key] = {
            ...item.entry,
            accessHistory: [], // Don't persist full history
            originalValue: undefined // Don't persist cached value
          };
          
          await fs.writeFile(filename, JSON.stringify(data, null, 2));
        } else if (item.action === 'delete') {
          // Handle deletion from disk
          const namespace = item.key.split(':')[0];
          const filename = path.join(
            this.config.persistenceDir,
            `${namespace}_${this.hashKey(item.key) % 100}.json`
          );
          
          try {
            const existing = await fs.readFile(filename, 'utf8');
            const data = JSON.parse(existing);
            delete data[item.key];
            await fs.writeFile(filename, JSON.stringify(data, null, 2));
          } catch (error) {
            // File doesn't exist or other error - ignore
          }
        }
      }
      
      this.persistenceQueue = [];
      this.isDirty = false;
      this.lastSync = Date.now();
      
      this.emit('persisted', { entries: this.memory.size });
    } catch (error) {
      console.error('Failed to save memory to disk:', error);
      this.emit('persistence:error', error);
    }
  }

}
