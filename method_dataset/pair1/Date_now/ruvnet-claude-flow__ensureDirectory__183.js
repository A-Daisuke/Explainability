function __method_wrapper__() {
  async ensureDirectory(path: string): Promise<FileOperationResult> {
    const start = Date.now();

    try {
      await fs.mkdir(path, { recursive: true });

      this.trackOperation('mkdir', 0);

      return {
        path,
        operation: 'mkdir',
        success: true,
        duration: Date.now() - start,
      };
    } catch (error) {
      this.metrics.errors++;
      this.logger.error('Failed to create directory', { path, error });

      return {
        path,
        operation: 'mkdir',
        success: false,
        duration: Date.now() - start,
        error: error as Error,
      };
    }
  }

}
