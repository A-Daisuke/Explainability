function __method_wrapper__() {
  private async archiveEntries(entries: MemoryEntry[], archivePath: string): Promise<void> {
    const archiveData = {
      archivedAt: new Date().toISOString(),
      entries: entries,
    };

    const archiveFile = join(archivePath, `archive-${Date.now()}.json`);
    await fs.mkdir(dirname(archiveFile), { recursive: true });
    await fs.writeFile(archiveFile, JSON.stringify(archiveData, null, 2));

    // Remove archived entries from active memory
    for (const entry of entries) {
      await this.deleteEntry(entry.id);
    }
  }

}
