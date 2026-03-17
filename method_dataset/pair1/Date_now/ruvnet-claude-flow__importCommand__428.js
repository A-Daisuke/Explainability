async function importCommand(args: string[], flags: Record<string, any>): Promise<void> {
  const file = args[0];

  if (!file) {
    printError('Usage: memory import <file> [options]');
    console.log('Options:');
    console.log('  --format <format>           Import format (json|csv|xml|yaml)');
    console.log('  --namespace <namespace>     Target namespace for imported data');
    console.log(
      '  --conflict-resolution <strategy> Conflict resolution (overwrite|skip|merge|rename)',
    );
    console.log('  --validation                Enable data validation');
    console.log('  --dry-run                   Show what would be imported without making changes');
    return;
  }

  try {
    // Check if file exists
    try {
      await fs.access(file);
    } catch {
      printError(`File not found: ${file}`);
      return;
    }

    const manager = await ensureMemoryManager();

    // Determine format from file extension if not specified
    let format = flags.format;
    if (!format) {
      const ext = extname(file).toLowerCase();
      switch (ext) {
        case '.json':
          format = 'json';
          break;
        case '.csv':
          format = 'csv';
          break;
        case '.xml':
          format = 'xml';
          break;
        case '.yaml':
        case '.yml':
          format = 'yaml';
          break;
        default:
          printError('Cannot determine format from file extension. Please specify --format');
          return;
      }
    }

    // Build import options
    const importOptions: ImportOptions = {
      format: format as ImportOptions['format'],
      namespace: flags.namespace,
      conflictResolution: flags['conflict-resolution'] || 'skip',
      validation: flags.validation,
      dryRun: flags['dry-run'],
    };

    if (flags['dry-run']) {
      printWarning('DRY RUN MODE - No changes will be made');
    }

    printInfo(`Starting import from ${file} (format: ${format})`);
    const startTime = Date.now();

    const result = await manager.import(file, importOptions);
    const duration = Date.now() - startTime;

    printSuccess(`Import completed in ${formatDuration(duration)}`);

    if (result.entriesImported > 0) {
      console.log(`📥 Imported: ${result.entriesImported} entries`);
    }
    if (result.entriesUpdated > 0) {
      console.log(`🔄 Updated: ${result.entriesUpdated} entries`);
    }
    if (result.entriesSkipped > 0) {
      console.log(`⏭️  Skipped: ${result.entriesSkipped} entries`);
    }
    if (result.conflicts.length > 0) {
      console.log(`⚠️  Conflicts: ${result.conflicts.length}`);
      if (result.conflicts.length <= 10) {
        result.conflicts.forEach((conflict) => {
          console.log(`   • ${conflict}`);
        });
      } else {
        result.conflicts.slice(0, 10).forEach((conflict) => {
          console.log(`   • ${conflict}`);
        });
        console.log(`   ... and ${result.conflicts.length - 10} more`);
      }
    }
  } catch (error) {
    printError(`Import failed: ${error instanceof Error ? error.message : String(error)}`);
    if (flags.debug) {
      console.error(error);
    }
  }
}
