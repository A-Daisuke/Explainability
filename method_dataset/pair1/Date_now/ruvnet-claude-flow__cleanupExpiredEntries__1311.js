function __method_wrapper__() {
  private async cleanupExpiredEntries(): Promise<void> {
    const now = Date.now();
    const expiredEntries: string[] = [];
    
    for (const [id, entry] of this.history.entries()) {
      if (now - entry.timestamp > this.ttlMs) {
        expiredEntries.push(id);
      }
    }
    
    for (const id of expiredEntries) {
      await this.deleteEntry(id);
    }
    
    if (expiredEntries.length > 0) {
      this.emit('entries_expired', expiredEntries.length);
    }
  }

}
