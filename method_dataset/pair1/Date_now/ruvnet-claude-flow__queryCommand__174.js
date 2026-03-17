async function queryCommand(args: string[], flags: Record<string, any>): Promise<void> {
  const search = args[0];

  if (!search) {
    printError('Usage: memory query <search> [options]');
    console.log('Options:');
    console.log('  --namespace <ns>        Filter by namespace');
    console.log('  --type <type>           Filter by data type');
    console.log('  --tags <tags>           Filter by tags (comma-separated)');
    console.log('  --owner <owner>         Filter by owner');
    console.log('  --access-level <level>  Filter by access level (private|shared|public)');
    console.log('  --key-pattern <pattern> Key pattern (regex)');
    console.log('  --value-search <text>   Search in values');
    console.log('  --full-text <text>      Full-text search');
    console.log('  --created-after <date>  Created after date (ISO format)');
    console.log('  --created-before <date> Created before date (ISO format)');
    console.log('  --updated-after <date>  Updated after date (ISO format)');
    console.log('  --updated-before <date> Updated before date (ISO format)');
    console.log('  --size-gt <bytes>       Size greater than (bytes)');
    console.log('  --size-lt <bytes>       Size less than (bytes)');
    console.log('  --include-expired       Include expired entries');
    console.log('  --limit <num>           Limit results');
    console.log('  --offset <num>          Offset for pagination');
    console.log(
      '  --sort-by <field>       Sort by field (key|createdAt|updatedAt|lastAccessedAt|size|type)',
    );
    console.log('  --sort-order <order>    Sort order (asc|desc)');
    console.log('  --aggregate-by <field>  Generate aggregations (namespace|type|owner|tags)');
    console.log('  --include-metadata      Include full metadata in results');
    console.log('  --format <format>       Output format (table|json|csv)');
    return;
  }

  try {
    const manager = await ensureMemoryManager();
    const startTime = Date.now();

    // Build query options from flags
    const queryOptions: QueryOptions = {
      fullTextSearch: search,
      namespace: flags.namespace,
      type: flags.type,
      tags: flags.tags ? flags.tags.split(',').map((t: string) => t.trim()) : undefined,
      owner: flags.owner,
      accessLevel: flags['access-level'],
      keyPattern: flags['key-pattern'],
      valueSearch: flags['value-search'],
      createdAfter: flags['created-after'] ? new Date(flags['created-after']) : undefined,
      createdBefore: flags['created-before'] ? new Date(flags['created-before']) : undefined,
      updatedAfter: flags['updated-after'] ? new Date(flags['updated-after']) : undefined,
      updatedBefore: flags['updated-before'] ? new Date(flags['updated-before']) : undefined,
      sizeGreaterThan: flags['size-gt'] ? parseInt(flags['size-gt']) : undefined,
      sizeLessThan: flags['size-lt'] ? parseInt(flags['size-lt']) : undefined,
      includeExpired: flags['include-expired'],
      limit: flags.limit ? parseInt(flags.limit) : undefined,
      offset: flags.offset ? parseInt(flags.offset) : undefined,
      sortBy: flags['sort-by'],
      sortOrder: flags['sort-order'] || 'asc',
      aggregateBy: flags['aggregate-by'],
      includeMetadata: flags['include-metadata'],
    };

    const result = await manager.query(queryOptions);
    const duration = Date.now() - startTime;

    printSuccess(`Found ${result.total} entries in ${formatDuration(duration)}`);

    if (result.entries.length === 0) {
      printInfo('No entries match your query criteria.');
      return;
    }

    // Display results based on format
    const format = flags.format || 'table';
    switch (format) {
      case 'json':
        console.log(
          JSON.stringify(
            {
              query: queryOptions,
              results: result,
              executionTime: duration,
            },
            null,
            2,
          ),
        );
        break;

      case 'csv':
        console.log('key,value,type,namespace,tags,size,created,updated');
        for (const entry of result.entries) {
          console.log(
            [
              entry.key,
              JSON.stringify(entry.value).replace(/"/g, '""'),
              entry.type,
              entry.namespace,
              entry.tags.join(';'),
              entry.size,
              entry.createdAt.toISOString(),
              entry.updatedAt.toISOString(),
            ].join(','),
          );
        }
        break;

      default: // table
        console.log('\n📋 Query Results:\n');
        result.entries.forEach((entry, i) => {
          const value =
            typeof entry.value === 'string' && entry.value.length > 100
              ? entry.value.substring(0, 100) + '...'
              : JSON.stringify(entry.value);

          console.log(`${i + 1}. ${entry.key}`);
          console.log(
            `   Type: ${entry.type} | Namespace: ${entry.namespace} | Size: ${formatBytes(entry.size)}`,
          );
          console.log(`   Tags: [${entry.tags.join(', ')}]`);
          console.log(`   Value: ${value}`);
          console.log(
            `   Created: ${entry.createdAt.toLocaleString()} | Updated: ${entry.updatedAt.toLocaleString()}`,
          );
          console.log(`   Last Accessed: ${entry.lastAccessedAt.toLocaleString()}`);

          if (flags['include-metadata'] && Object.keys(entry.metadata).length > 0) {
            console.log(`   Metadata: ${JSON.stringify(entry.metadata)}`);
          }
          console.log();
        });
    }

    // Show aggregations if requested
    if (result.aggregations) {
      console.log('\n📊 Aggregations:\n');
      for (const [key, value] of Object.entries(result.aggregations)) {
        console.log(`${key}:`);
        for (const [subKey, stats] of Object.entries(value as Record<string, any>)) {
          console.log(`  ${subKey}: ${stats.count} entries, ${formatBytes(stats.totalSize)}`);
        }
        console.log();
      }
    }

    // Show pagination info
    if (result.total > result.entries.length) {
      const showing = (flags.offset ? parseInt(flags.offset) : 0) + result.entries.length;
      console.log(`Showing ${showing} of ${result.total} entries`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    printError(`Query failed: ${message}`);
    if (flags.debug) {
      console.error(error);
    }
  }
}
