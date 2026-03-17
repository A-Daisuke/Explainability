class __C__ {
  async createBackup(type = 'manual', description = '') {
    const result = {
      success: true,
      id: null,
      location: null,
      errors: [],
      warnings: [],
      files: [],
    };

    try {
      // Generate backup ID
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupId = `${type}-${timestamp}`;
      result.id = backupId;

      // Create backup directory
      const backupPath = `${this.backupDir}/${backupId}`;
      result.location = backupPath;

      await this.ensureBackupDir();
      await Deno.mkdir(backupPath, { recursive: true });

      // Create backup manifest
      const manifest = {
        id: backupId,
        type,
        description,
        timestamp: Date.now(),
        workingDir: this.workingDir,
        files: [],
        directories: [],
      };

      // Backup critical files
      const criticalFiles = await this.getCriticalFiles();
      for (const file of criticalFiles) {
        const backupResult = await this.backupFile(file, backupPath);
        if (backupResult.success) {
          manifest.files.push(backupResult.fileInfo);
          result.files.push(file);
        } else {
          result.warnings.push(`Failed to backup file: ${file}`);
        }
      }

      // Backup critical directories
      const criticalDirs = await this.getCriticalDirectories();
      for (const dir of criticalDirs) {
        const backupResult = await this.backupDirectory(dir, backupPath);
        if (backupResult.success) {
          manifest.directories.push(backupResult.dirInfo);
        } else {
          result.warnings.push(`Failed to backup directory: ${dir}`);
        }
      }

      // Save manifest
      await Deno.writeTextFile(`${backupPath}/manifest.json`, JSON.stringify(manifest, null, 2));

      // Create backup metadata
      const metadata = {
        created: Date.now(),
        size: await this.calculateBackupSize(backupPath),
        fileCount: manifest.files.length,
        dirCount: manifest.directories.length,
      };

      await Deno.writeTextFile(`${backupPath}/metadata.json`, JSON.stringify(metadata, null, 2));

      console.log(`  ✓ Backup created: ${backupId}`);
      console.log(`  📁 Files backed up: ${result.files.length}`);
    } catch (error) {
      result.success = false;
      result.errors.push(`Backup creation failed: ${error.message}`);
    }

    return result;
  }

}
