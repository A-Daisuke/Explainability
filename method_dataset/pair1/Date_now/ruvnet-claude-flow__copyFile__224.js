function __method_wrapper__() {
  async copyFile(source: string, destination: string): Promise<FileOperationResult> {
    const start = Date.now();

    return this.writeQueue.add(async () => {
      try {
        await this.ensureDirectory(dirname(destination));
        await fs.copyFile(source, destination);

        const stats = await fs.stat(destination);
        this.trackOperation('write', stats.size);

        return {
          path: destination,
          operation: 'write',
          success: true,
          duration: Date.now() - start,
          size: stats.size,
        };
      } catch (error) {
        this.metrics.errors++;
        this.logger.error('Failed to copy file', { source, destination, error });

        return {
          path: destination,
          operation: 'write',
          success: false,
          duration: Date.now() - start,
          error: error as Error,
        };
      }
    });
  }

}
