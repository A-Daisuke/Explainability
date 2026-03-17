function __method_wrapper__() {
  async cleanup(options: CleanupOptions = {}): Promise<{
    entriesRemoved: number;
    entriesArchived: number;
    entriesCompressed: number;
    spaceSaved: number;
    actions: string[];
  }> {
    const startTime = Date.now();

    try {
      this.logger.info('Starting memory cleanup', options);

      const results = {
        entriesRemoved: 0,
        entriesArchived: 0,
        entriesCompressed: 0,
        spaceSaved: 0,
        actions: [] as string[],
      };

      // Get all entries for processing
      const allEntries = Array.from(this.entries.values());
      const now = new Date();

      // Phase 1: Remove expired entries
      if (options.removeExpired !== false) {
        const expiredEntries = allEntries.filter(
          (entry) => entry.expiresAt && entry.expiresAt < now,
        );

        for (const entry of expiredEntries) {
          if (!options.dryRun) {
            await this.deleteEntry(entry.id);
          }
          results.entriesRemoved++;
          results.spaceSaved += entry.size;
        }

        if (expiredEntries.length > 0) {
          results.actions.push(`Removed ${expiredEntries.length} expired entries`);
        }
      }

      // Phase 2: Remove old entries
      if (options.removeOlderThan) {
        const cutoffDate = new Date(now.getTime() - options.removeOlderThan * 24 * 60 * 60 * 1000);
        const oldEntries = allEntries.filter((entry) => entry.createdAt < cutoffDate);

        for (const entry of oldEntries) {
          if (!options.dryRun) {
            await this.deleteEntry(entry.id);
          }
          results.entriesRemoved++;
          results.spaceSaved += entry.size;
        }

        if (oldEntries.length > 0) {
          results.actions.push(
            `Removed ${oldEntries.length} entries older than ${options.removeOlderThan} days`,
          );
        }
      }

      // Phase 3: Remove unaccessed entries
      if (options.removeUnaccessed) {
        const cutoffDate = new Date(now.getTime() - options.removeUnaccessed * 24 * 60 * 60 * 1000);
        const unaccessedEntries = allEntries.filter((entry) => entry.lastAccessedAt < cutoffDate);

        for (const entry of unaccessedEntries) {
          if (!options.dryRun) {
            await this.deleteEntry(entry.id);
          }
          results.entriesRemoved++;
          results.spaceSaved += entry.size;
        }

        if (unaccessedEntries.length > 0) {
          results.actions.push(
            `Removed ${unaccessedEntries.length} entries not accessed in ${options.removeUnaccessed} days`,
          );
        }
      }

      // Phase 4: Archive old entries
      if (options.archiveOld?.enabled) {
        const cutoffDate = new Date(
          now.getTime() - options.archiveOld.olderThan * 24 * 60 * 60 * 1000,
        );
        const archiveEntries = allEntries.filter(
          (entry) => entry.createdAt < cutoffDate && !entry.expiresAt, // Don't archive entries that will expire
        );

        if (archiveEntries.length > 0 && !options.dryRun) {
          await this.archiveEntries(archiveEntries, options.archiveOld.archivePath);
        }

        results.entriesArchived = archiveEntries.length;
        if (archiveEntries.length > 0) {
          results.actions.push(`Archived ${archiveEntries.length} old entries`);
        }
      }

      // Phase 5: Compress eligible entries
      if (options.compressEligible !== false && this.config.autoCompress) {
        const uncompressedEntries = allEntries.filter(
          (entry) => !entry.compressed && entry.size > this.config.compressionThreshold,
        );

        for (const entry of uncompressedEntries) {
          if (!options.dryRun) {
            const originalSize = entry.size;
            const compressedValue = await this.compressValue(entry.value);
            entry.value = compressedValue;
            entry.compressed = true;
            entry.size = this.calculateSize(compressedValue);
            results.spaceSaved += originalSize - entry.size;
          }
          results.entriesCompressed++;
        }

        if (uncompressedEntries.length > 0) {
          results.actions.push(`Compressed ${uncompressedEntries.length} entries`);
        }
      }

      // Phase 6: Apply retention policies
      if (options.retentionPolicies) {
        for (const policy of options.retentionPolicies) {
          const policyResults = await this.applyRetentionPolicy(policy, options.dryRun);
          results.entriesRemoved += policyResults.removed;
          results.spaceSaved += policyResults.spaceSaved;
          if (policyResults.removed > 0) {
            results.actions.push(
              `Retention policy '${policy.namespace}': removed ${policyResults.removed} entries`,
            );
          }
        }
      }

      // Phase 7: Remove orphaned references
      if (options.removeOrphaned !== false) {
        const orphanedCount = await this.cleanupOrphanedReferences(options.dryRun);
        if (orphanedCount > 0) {
          results.actions.push(`Cleaned up ${orphanedCount} orphaned references`);
        }
      }

      // Phase 8: Remove duplicates
      if (options.removeDuplicates) {
        const duplicatesResults = await this.removeDuplicateEntries(options.dryRun);
        results.entriesRemoved += duplicatesResults.removed;
        results.spaceSaved += duplicatesResults.spaceSaved;
        if (duplicatesResults.removed > 0) {
          results.actions.push(`Removed ${duplicatesResults.removed} duplicate entries`);
        }
      }

      // Rebuild index if significant changes
      if (results.entriesRemoved + results.entriesArchived > 100 && !options.dryRun) {
        await this.rebuildIndex();
        results.actions.push('Rebuilt search index');
      }

      this.logger.info('Memory cleanup completed', results);
      this.emit('memory:cleanup-completed', results);

      this.recordMetric('cleanup', Date.now() - startTime);
      return results;
    } catch (error) {
      this.recordMetric('cleanup-error', Date.now() - startTime);
      throw error;
    }
  }

}
