async function cleanupCommand(args: string[], flags: Record<string, any>): Promise<void> {
  try {
    const manager = await ensureMemoryManager();

    if (flags['dry-run']) {
      printWarning('DRY RUN MODE - No changes will be made');
    }

    // Build cleanup options
    const cleanupOptions: CleanupOptions = {
      dryRun: flags['dry-run'],
      removeExpired: flags['remove-expired'] !== false,
      removeOlderThan: flags['remove-older-than']
        ? parseInt(flags['remove-older-than'])
        : undefined,
      removeUnaccessed: flags['remove-unaccessed']
        ? parseInt(flags['remove-unaccessed'])
        : undefined,
      removeOrphaned: flags['remove-orphaned'] !== false,
      removeDuplicates: flags['remove-duplicates'],
      compressEligible: flags['compress-eligible'] !== false,
      archiveOld: flags['archive-old']
        ? {
            enabled: true,
            olderThan: flags['archive-older-than'] ? parseInt(flags['archive-older-than']) : 365,
            archivePath: flags['archive-path'] || './memory/archive',
          }
        : undefined,
    };

    printInfo('Starting memory cleanup...');
    const startTime = Date.now();

    const result = await manager.cleanup(cleanupOptions);
    const duration = Date.now() - startTime;

    printSuccess(`Cleanup completed in ${formatDuration(duration)}`);

    if (result.entriesRemoved > 0) {
      console.log(`🗑️  Removed: ${result.entriesRemoved} entries`);
    }
    if (result.entriesArchived > 0) {
      console.log(`📦 Archived: ${result.entriesArchived} entries`);
    }
    if (result.entriesCompressed > 0) {
      console.log(`🗜️  Compressed: ${result.entriesCompressed} entries`);
    }
    if (result.spaceSaved > 0) {
      console.log(`💾 Space Saved: ${formatBytes(result.spaceSaved)}`);
    }

    if (result.actions.length > 0) {
      console.log('\n📋 Actions Performed:');
      result.actions.forEach((action) => {
        console.log(`   • ${action}`);
      });
    }

    if (flags['dry-run'] && (result.entriesRemoved > 0 || result.entriesArchived > 0)) {
      printInfo('Run without --dry-run to perform these actions');
    }
  } catch (error) {
    printError(`Cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
    if (flags.debug) {
      console.error(error);
    }
  }
}
