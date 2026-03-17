async function exportCommand(args: string[], flags: Record<string, any>): Promise<void> {
  const file = args[0];

  if (!file) {
    printError('Usage: memory export <file> [options]');
    console.log('Options:');
    console.log('  --format <format>       Export format (json|csv|xml|yaml)');
    console.log('  --namespace <namespace> Export specific namespace');
    console.log('  --type <type>           Export specific type');
    console.log('  --include-metadata      Include full metadata');
    console.log('  --compression           Enable compression');
    console.log('  --encrypt               Enable encryption');
    console.log('  --encrypt-key <key>     Encryption key');
    console.log('  --filter-query <json>   Advanced filtering (JSON query options)');
    return;
  }

  try {
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
          format = 'json';
      }
    }

    // Parse filter query if provided
    let filtering: QueryOptions | undefined;
    if (flags['filter-query']) {
      try {
        filtering = JSON.parse(flags['filter-query']);
      } catch (error) {
        printError('Invalid filter query JSON format');
        return;
      }
    }

    // Build export options
    const exportOptions: ExportOptions = {
      format: format as ExportOptions['format'],
      namespace: flags.namespace,
      type: flags.type,
      includeMetadata: flags['include-metadata'],
      compression: flags.compression,
      encryption: flags.encrypt
        ? {
            enabled: true,
            key: flags['encrypt-key'],
          }
        : undefined,
      filtering,
    };

    printInfo(`Starting export to ${file} (format: ${format})`);
    const startTime = Date.now();

    const result = await manager.export(file, exportOptions);
    const duration = Date.now() - startTime;

    printSuccess(`Export completed in ${formatDuration(duration)}`);
    console.log(`📊 Exported: ${result.entriesExported} entries`);
    console.log(`📁 File size: ${formatBytes(result.fileSize)}`);
    console.log(`🔒 Checksum: ${result.checksum}`);

    if (flags.compression) {
      printInfo('Data was compressed during export');
    }
    if (flags.encrypt) {
      printInfo('Data was encrypted during export');
    }
  } catch (error) {
    printError(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
    if (flags.debug) {
      console.error(error);
    }
  }
}
