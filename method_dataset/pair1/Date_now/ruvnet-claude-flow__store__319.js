function __method_wrapper__() {
  async store(
    key: string,
    value: any,
    options: {
      type?: string;
      tags?: string[];
      owner?: AgentId;
      accessLevel?: AccessLevel;
      partition?: string;
      ttl?: number;
      replicate?: boolean;
    } = {},
  ): Promise<string> {
    const startTime = Date.now();

    try {
      const entryId = generateId('entry');
      const now = new Date();

      // Determine partition
      const partitionId = options.partition || this.selectPartition(options.type || 'knowledge');
      const partition = this.partitions.get(partitionId);

      if (!partition) {
        throw new Error(`Partition ${partitionId} not found`);
      }

      if (partition.readOnly) {
        throw new Error('Cannot write to read-only partition');
      }

      // Check partition capacity
      if (this.getPartitionSize(partitionId) >= partition.maxSize) {
        await this.evictOldEntries(partitionId);
      }

      // Create entry
      const entry: MemoryEntry = {
        id: entryId,
        key,
        value: await this.processValue(value, partition),
        type: options.type || 'data',
        tags: options.tags || [],
        owner: options.owner || { id: 'system', swarmId: '', type: 'coordinator', instance: 0 },
        accessLevel: options.accessLevel || 'swarm',
        createdAt: now,
        updatedAt: now,
        expiresAt: options.ttl ? new Date(now.getTime() + options.ttl) : undefined,
        version: 1,
        references: [],
        dependencies: [],
      };

      // Store entry
      this.entries.set(entryId, entry);
      partition.entries.push(entry);

      // Update cache
      this.updateCache(entryId, entry);

      // Update vector clock
      this.incrementVectorClock(this.localNodeId);

      this.logger.debug('Stored entry', { entryId, key, partition: partitionId });
      this.emit('memory:entry-stored', { entry });

      // Replicate if distributed and requested
      if (this.config.distributed && options.replicate !== false) {
        await this.replicateEntry(entry);
      }

      this.recordMetric('store', Date.now() - startTime);
      return entryId;
    } catch (error) {
      this.recordMetric('store-error', Date.now() - startTime);
      throw error;
    }
  }

}
