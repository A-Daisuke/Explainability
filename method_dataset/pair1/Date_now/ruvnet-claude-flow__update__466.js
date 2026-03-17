function __method_wrapper__() {
  async update(
    key: string,
    value: any,
    options: {
      partition?: string;
      merge?: boolean;
      version?: number;
    } = {},
  ): Promise<boolean> {
    const startTime = Date.now();

    try {
      const entry = await this.retrieve(key, { partition: options.partition });
      if (!entry) {
        this.recordMetric('update-not-found', Date.now() - startTime);
        return false;
      }

      // Check access permissions
      if (!this.checkAccess(entry, 'write')) {
        throw new Error('Access denied for update operation');
      }

      // Version check for optimistic locking
      if (options.version && entry.version !== options.version) {
        throw new Error('Version conflict: entry has been modified');
      }

      // Update entry
      const partition = this.partitions.get(this.getEntryPartition(entry.id))!;

      entry.value = options.merge
        ? await this.mergeValues(entry.value, value, partition)
        : await this.processValue(value, partition);

      entry.updatedAt = new Date();
      entry.version++;

      // Update cache
      this.updateCache(entry.id, entry);

      // Update vector clock
      this.incrementVectorClock(this.localNodeId);

      this.logger.debug('Updated entry', { entryId: entry.id, key });
      this.emit('memory:entry-updated', { entry });

      // Sync with other nodes if distributed
      if (this.config.distributed) {
        await this.syncEntryUpdate(entry);
      }

      this.recordMetric('update', Date.now() - startTime);
      return true;
    } catch (error) {
      this.recordMetric('update-error', Date.now() - startTime);
      throw error;
    }
  }

}
