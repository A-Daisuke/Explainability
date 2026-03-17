function __method_wrapper__() {
    return this.writeQueue.add(async () => {
      try {
        await fs.unlink(path);

        this.trackOperation('delete', 0);

        return {
          path,
          operation: 'delete',
          success: true,
          duration: Date.now() - start,
        };
      } catch (error) {
        this.metrics.errors++;
        this.logger.error('Failed to delete file', { path, error });

        return {
          path,
          operation: 'delete',
          success: false,
          duration: Date.now() - start,
          error: error as Error,
        };
      }
    });

}
