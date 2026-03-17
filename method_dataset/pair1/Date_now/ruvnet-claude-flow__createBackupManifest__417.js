function __method_wrapper__() {
  private async createBackupManifest(): Promise<string> {
    const manifestPath = path.join(
      this.options.destination,
      '.prompt-backups',
      `manifest-${Date.now()}.json`,
    );

    const manifest = {
      timestamp: new Date().toISOString(),
      source: this.options.source,
      destination: this.options.destination,
      backups: Array.from(this.backupMap.entries()).map(([original, backup]) => ({
        original,
        backup,
      })),
    };

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    return manifestPath;
  }

}
