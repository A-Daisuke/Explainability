function __method_wrapper__() {
  async update(
    key: string,
    value: any,
    options: {
      namespace?: string;
      merge?: boolean;
      updateMetadata?: Record<string, any>;
    } = {},
  ): Promise<boolean> {
    const startTime = Date.now();

    try {
      const entry = await this.retrieve(key, { namespace: options.namespace });
      if (!entry) {
        this.recordMetric('update-not-found', Date.now() - startTime);
        return false;
      }

      // Process new value
      const processedValue = await this.processValue(value, entry.compressed);

      // Update entry
      if (options.merge && typeof entry.value === 'object' && typeof value === 'object') {
        entry.value = { ...entry.value, ...processedValue.value };
      } else {
        entry.value = processedValue.value;
      }

      entry.updatedAt = new Date();
      entry.lastAccessedAt = new Date();
      entry.version++;
      entry.size = this.calculateSize(entry.value);
      entry.checksum = this.calculateChecksum(entry.value);

      if (options.updateMetadata) {
        entry.metadata = { ...entry.metadata, ...options.updateMetadata };
      }

      // Update index
      if (this.config.indexingEnabled) {
        this.updateIndex(entry, 'update');
      }

      // Update cache
      this.updateCache(key, entry);

      this.logger.debug('Memory entry updated', { entryId: entry.id, key });
      this.emit('memory:entry-updated', { entry });

      this.recordMetric('update', Date.now() - startTime);
      return true;
    } catch (error) {
      this.recordMetric('update-error', Date.now() - startTime);
      throw error;
    }
  }

}
