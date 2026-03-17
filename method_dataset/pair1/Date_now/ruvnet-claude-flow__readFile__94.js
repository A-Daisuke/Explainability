function __method_wrapper__() {
  async readFile(path: string): Promise<FileOperationResult & { data?: string }> {
    const start = Date.now();

    return await this.readQueue.add(async () => {
      try {
        const data = await fs.readFile(path, 'utf8');
        const duration = Date.now() - start;
        const size = Buffer.byteLength(data);

        this.trackOperation('read', size);

        return {
          path,
          operation: 'read' as const,
          success: true,
          duration,
          size,
          data,
        };
      } catch (error) {
        this.metrics.errors++;
        this.logger.error('Failed to read file', { path, error });

        return {
          path,
          operation: 'read' as const,
          success: false,
          duration: Date.now() - start,
          error: error as Error,
        };
      }
    });
  }

}
