function __method_wrapper__() {
  cleanupStaleLocks(maxAgeMs: number): number {
    const now = Date.now();
    let removed = 0;

    for (const [resourceId, lock] of this.locks) {
      if (now - lock.timestamp.getTime() > maxAgeMs) {
        this.locks.delete(resourceId);
        removed++;

        this.logger.warn('Removed stale lock', {
          resourceId,
          holder: lock.holder,
          age: now - lock.timestamp.getTime(),
        });
      }
    }

    return removed;
  }

}
