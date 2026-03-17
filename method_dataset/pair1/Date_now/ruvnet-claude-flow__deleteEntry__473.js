function __method_wrapper__() {
  async deleteEntry(entryId: string): Promise<boolean> {
    const startTime = Date.now();

    try {
      const entry = this.entries.get(entryId);
      if (!entry) {
        this.recordMetric('delete-not-found', Date.now() - startTime);
        return false;
      }

      // Remove from storage
      this.entries.delete(entryId);

      // Update index
      if (this.config.indexingEnabled) {
        this.updateIndex(entry, 'delete');
      }

      // Remove from cache
      this.cache.delete(entry.key);

      this.logger.debug('Memory entry deleted', { entryId, key: entry.key });
      this.emit('memory:entry-deleted', { entryId });

      this.recordMetric('delete', Date.now() - startTime);
      return true;
    } catch (error) {
      this.recordMetric('delete-error', Date.now() - startTime);
      throw error;
    }
  }

}
