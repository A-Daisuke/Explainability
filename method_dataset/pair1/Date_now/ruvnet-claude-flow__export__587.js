function __method_wrapper__() {
  async export(
    filePath: string,
    options: ExportOptions,
  ): Promise<{
    entriesExported: number;
    fileSize: number;
    checksum: string;
  }> {
    const startTime = Date.now();

    try {
      this.logger.info('Starting memory export', { filePath, format: options.format });

      // Query entries to export
      const queryResult = await this.query(options.filtering || {});
      const entries = queryResult.entries;

      if (entries.length === 0) {
        throw new Error('No entries found matching export criteria');
      }

      // Prepare export data
      let exportData: any;

      switch (options.format) {
        case 'json':
          exportData = this.prepareJsonExport(entries, options);
          break;
        case 'csv':
          exportData = this.prepareCsvExport(entries, options);
          break;
        case 'xml':
          exportData = this.prepareXmlExport(entries, options);
          break;
        case 'yaml':
          exportData = this.prepareYamlExport(entries, options);
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      // Apply compression if requested
      if (options.compression) {
        exportData = await this.compressData(exportData);
      }

      // Apply encryption if requested
      if (options.encryption?.enabled) {
        exportData = await this.encryptData(exportData, options.encryption);
      }

      // Write to file
      await fs.mkdir(dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, exportData);

      // Calculate file stats
      const stats = await fs.stat(filePath);
      const checksum = this.calculateChecksum(exportData);

      this.logger.info('Memory export completed', {
        entriesExported: entries.length,
        fileSize: stats.size,
        checksum,
      });

      this.emit('memory:exported', {
        filePath,
        entriesExported: entries.length,
        fileSize: stats.size,
      });

      this.recordMetric('export', Date.now() - startTime);

      return {
        entriesExported: entries.length,
        fileSize: stats.size,
        checksum,
      };
    } catch (error) {
      this.recordMetric('export-error', Date.now() - startTime);
      throw error;
    }
  }

}
