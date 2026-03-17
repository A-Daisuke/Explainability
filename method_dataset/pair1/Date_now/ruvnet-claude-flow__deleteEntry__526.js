function __method_wrapper__() {
  async deleteEntry(entryId: string): Promise<boolean> {
    const startTime = Date.now();

    try {
      const entry = this.entries.get(entryId);
      if (!entry) {
        this.recordMetric('delete-not-found', Date.now() - startTime);
        return false;
      }

      // Check access permissions
      if (!this.checkAccess(entry, 'delete')) {
        throw new Error('Access denied for delete operation');
      }

      // Remove from partition
      const partitionId = this.getEntryPartition(entryId);
      const partition = this.partitions.get(partitionId);
      if (partition) {
        partition.entries = partition.entries.filter((e) => e.id !== entryId);
      }

      // Remove from storage
      this.entries.delete(entryId);

      // Remove from cache
      this.removeFromCache(entry.key);

      // Update vector clock
      this.incrementVectorClock(this.localNodeId);

      this.logger.debug('Deleted entry', { entryId, key: entry.key });
      this.emit('memory:entry-deleted', { entryId });

      // Sync with other nodes if distributed
      if (this.config.distributed) {
        await this.syncEntryDeletion(entryId);
      }

      this.recordMetric('delete', Date.now() - startTime);
      return true;
    } catch (error) {
      this.recordMetric('delete-error', Date.now() - startTime);
      throw error;
    }
  }

}
