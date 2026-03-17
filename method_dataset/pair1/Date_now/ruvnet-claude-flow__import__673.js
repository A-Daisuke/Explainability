function __method_wrapper__() {
  async import(
    filePath: string,
    options: ImportOptions,
  ): Promise<{
    entriesImported: number;
    entriesSkipped: number;
    entriesUpdated: number;
    conflicts: string[];
  }> {
    const startTime = Date.now();

    try {
      this.logger.info('Starting memory import', { filePath, format: options.format });

      // Read and parse file
      const fileContent = await fs.readFile(filePath, 'utf-8');
      let importData: any[];

      switch (options.format) {
        case 'json':
          importData = this.parseJsonImport(fileContent);
          break;
        case 'csv':
          importData = this.parseCsvImport(fileContent);
          break;
        case 'xml':
          importData = this.parseXmlImport(fileContent);
          break;
        case 'yaml':
          importData = this.parseYamlImport(fileContent);
          break;
        default:
          throw new Error(`Unsupported import format: ${options.format}`);
      }

      // Validate data if requested
      if (options.validation) {
        importData = this.validateImportData(importData);
      }

      // Apply transformations if provided
      if (options.transformation) {
        importData = this.transformImportData(importData, options.transformation);
      }

      // Process imports
      const results = {
        entriesImported: 0,
        entriesSkipped: 0,
        entriesUpdated: 0,
        conflicts: [] as string[],
      };

      for (const item of importData) {
        if (options.dryRun) {
          // Dry run - just check for conflicts
          const existing = this.findEntryByKey(item.key, item.namespace);
          if (existing) {
            results.conflicts.push(
              `Key '${item.key}' already exists in namespace '${item.namespace}'`,
            );
          }
          continue;
        }

        try {
          const result = await this.importSingleEntry(item, options);

          switch (result.action) {
            case 'imported':
              results.entriesImported++;
              break;
            case 'updated':
              results.entriesUpdated++;
              break;
            case 'skipped':
              results.entriesSkipped++;
              break;
            case 'conflict':
              results.conflicts.push(result.message || 'Unknown conflict');
              break;
          }
        } catch (error) {
          results.conflicts.push(
            `Error importing '${item.key}': ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }

      this.logger.info('Memory import completed', results);
      this.emit('memory:imported', results);

      this.recordMetric('import', Date.now() - startTime);
      return results;
    } catch (error) {
      this.recordMetric('import-error', Date.now() - startTime);
      throw error;
    }
  }

}
