function __method_wrapper__() {
  async writeFile(path: string, data: string | Buffer): Promise<FileOperationResult> {
    const start = Date.now();

    return await this.writeQueue.add(async () => {
      try {
        // Ensure directory exists
        await this.ensureDirectory(dirname(path));

        // Use streaming for large files
        if (data.length > 1024 * 1024) {
          // > 1MB
          await this.streamWrite(path, data);
        } else {
          await fs.writeFile(path, data, 'utf8');
        }

        const duration = Date.now() - start;
        const size = Buffer.byteLength(data);

        this.trackOperation('write', size);

        return {
          path,
          operation: 'write' as const,
          success: true,
          duration,
          size,
        };
      } catch (error) {
        this.metrics.errors++;
        this.logger.error('Failed to write file', { path, error });

        return {
          path,
          operation: 'write' as const,
          success: false,
          duration: Date.now() - start,
          error: error as Error,
        };
      }
    });
  }

}
