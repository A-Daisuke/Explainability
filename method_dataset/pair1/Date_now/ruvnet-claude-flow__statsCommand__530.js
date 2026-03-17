async function statsCommand(args: string[], flags: Record<string, any>): Promise<void> {
  try {
    const manager = await ensureMemoryManager();
    const startTime = Date.now();

    const stats = await manager.getStatistics();
    const duration = Date.now() - startTime;

    if (flags.format === 'json') {
      const output = {
        statistics: stats,
        generatedAt: new Date().toISOString(),
        generationTime: duration,
      };

      if (flags.export) {
        await fs.writeFile(flags.export, JSON.stringify(output, null, 2));
        printSuccess(`Statistics exported to ${flags.export}`);
      } else {
        console.log(JSON.stringify(output, null, 2));
      }
      return;
    }

    // Table format display
    console.log('🧠 Memory System Statistics\n');

    // Overview
    console.log('📊 Overview:');
    console.log(`   Total Entries: ${stats.overview.totalEntries.toLocaleString()}`);
    console.log(`   Total Size: ${formatBytes(stats.overview.totalSize)}`);
    console.log(
      `   Compressed Entries: ${stats.overview.compressedEntries.toLocaleString()} (${(stats.overview.compressionRatio * 100).toFixed(1)}% compression)`,
    );
    console.log(`   Index Size: ${formatBytes(stats.overview.indexSize)}`);
    console.log(`   Memory Usage: ${formatBytes(stats.overview.memoryUsage)}`);
    console.log(`   Disk Usage: ${formatBytes(stats.overview.diskUsage)}`);
    console.log();

    // Distribution
    console.log('📈 Distribution:');

    if (Object.keys(stats.distribution.byNamespace).length > 0) {
      console.log('   By Namespace:');
      for (const [namespace, data] of Object.entries(stats.distribution.byNamespace)) {
        console.log(`     ${namespace}: ${data.count} entries, ${formatBytes(data.size)}`);
      }
    }

    if (Object.keys(stats.distribution.byType).length > 0) {
      console.log('   By Type:');
      for (const [type, data] of Object.entries(stats.distribution.byType)) {
        console.log(`     ${type}: ${data.count} entries, ${formatBytes(data.size)}`);
      }
    }
    console.log();

    // Performance
    console.log('⚡ Performance:');
    console.log(`   Average Query Time: ${formatDuration(stats.performance.averageQueryTime)}`);
    console.log(`   Average Write Time: ${formatDuration(stats.performance.averageWriteTime)}`);
    console.log(`   Cache Hit Ratio: ${(stats.performance.cacheHitRatio * 100).toFixed(1)}%`);
    console.log(`   Index Efficiency: ${(stats.performance.indexEfficiency * 100).toFixed(1)}%`);
    console.log();

    // Health
    console.log('🏥 Health:');
    const healthStatus = stats.health.recommendedCleanup ? 'Needs Attention' : 'Healthy';
    console.log(`   Status: ${healthStatus}`);
    console.log(`   Expired Entries: ${stats.health.expiredEntries}`);
    console.log(`   Orphaned References: ${stats.health.orphanedReferences}`);
    console.log(`   Duplicate Keys: ${stats.health.duplicateKeys}`);
    console.log(`   Corrupted Entries: ${stats.health.corruptedEntries}`);
    console.log();

    // Optimization suggestions
    if (stats.optimization.suggestions.length > 0) {
      console.log('💡 Optimization Suggestions:');
      stats.optimization.suggestions.forEach((suggestion) => {
        console.log(`   • ${suggestion}`);
      });
      console.log();

      console.log('💰 Potential Savings:');
      console.log(
        `   Compression: ${formatBytes(stats.optimization.potentialSavings.compression)}`,
      );
      console.log(`   Cleanup: ${formatBytes(stats.optimization.potentialSavings.cleanup)}`);
      console.log(
        `   Deduplication: ${formatBytes(stats.optimization.potentialSavings.deduplication)}`,
      );
      console.log();
    }

    console.log(`Statistics generated in ${formatDuration(duration)}`);

    // Export if requested
    if (flags.export) {
      const output = {
        statistics: stats,
        generatedAt: new Date().toISOString(),
        generationTime: duration,
      };
      await fs.writeFile(flags.export, JSON.stringify(output, null, 2));
      printSuccess(`Statistics exported to ${flags.export}`);
    }
  } catch (error) {
    printError(`Stats failed: ${error instanceof Error ? error.message : String(error)}`);
    if (flags.debug) {
      console.error(error);
    }
  }
}
