function __method_wrapper__() {
  public async captureSnapshot(
    description: string,
    tags: string[] = [],
    triggeredBy: string = 'manual'
  ): Promise<SystemSnapshot> {
    const id = this.generateSnapshotId();
    const timestamp = Date.now();

    try {
      // Capture system state atomically
      const [config, memory, processes, files, git] = await Promise.all([
        this.captureConfig(),
        this.captureMemory(),
        this.captureProcesses(),
        this.captureFiles(),
        this.captureGitState()
      ]);

      const snapshot: SystemSnapshot = {
        id,
        timestamp,
        version: '1.0.0',
        metadata: {
          description,
          tags,
          triggeredBy,
          severity: 'medium'
        },
        state: {
          config,
          memory,
          processes,
          files,
          git
        },
        integrity: {
          checksum: '',
          compressed: this.compressionEnabled,
          size: 0
        }
      };

      // Calculate integrity checksum
      const serialized = JSON.stringify(snapshot.state);
      snapshot.integrity.checksum = createHash('sha256').update(serialized).digest('hex');
      snapshot.integrity.size = Buffer.byteLength(serialized, 'utf8');

      // Store snapshot
      await this.storeSnapshot(snapshot);
      this.snapshots.set(id, snapshot);

      // Cleanup old snapshots
      await this.cleanupOldSnapshots();

      this.emit('snapshot_created', snapshot);
      return snapshot;

    } catch (error) {
      this.emit('error', new Error(`Failed to capture snapshot: ${error}`));
      throw error;
    }
  }

}
