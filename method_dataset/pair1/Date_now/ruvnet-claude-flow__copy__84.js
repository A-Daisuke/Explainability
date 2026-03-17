function __method_wrapper__() {
  async copy(): Promise<CopyResult> {
    const startTime = Date.now();

    try {
      // Phase 1: Discovery
      logger.info('Starting prompt discovery phase...');
      await this.discoverFiles();

      if (this.fileQueue.length === 0) {
        return {
          success: true,
          totalFiles: 0,
          copiedFiles: 0,
          failedFiles: 0,
          skippedFiles: 0,
          duration: Date.now() - startTime,
          errors: [],
        };
      }

      // Phase 2: Pre-flight checks
      if (!this.options.dryRun) {
        await this.ensureDestinationDirectories();
      }

      // Phase 3: Copy files
      logger.info(`Copying ${this.fileQueue.length} files...`);
      if (this.options.parallel) {
        await this.copyFilesParallel();
      } else {
        await this.copyFilesSequential();
      }

      // Phase 4: Verification
      if (this.options.verify && !this.options.dryRun) {
        await this.verifyFiles();
      }

      const duration = Date.now() - startTime;
      const result: CopyResult = {
        success: this.errors.length === 0,
        totalFiles: this.fileQueue.length,
        copiedFiles: this.copiedFiles.size,
        failedFiles: this.errors.length,
        skippedFiles: this.fileQueue.length - this.copiedFiles.size - this.errors.length,
        errors: this.errors,
        duration,
      };

      if (this.backupMap.size > 0) {
        result.backupLocation = await this.createBackupManifest();
      }

      logger.info(`Copy completed in ${duration}ms`, result);
      return result;
    } catch (error) {
      logger.error('Copy operation failed', error);

      if (!this.options.dryRun) {
        await this.rollback();
      }

      throw error;
    }
  }

}
