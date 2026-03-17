function __method_wrapper__() {
  cleanupOldConflicts(maxAgeMs: number): number {
    const now = Date.now();
    let removed = 0;

    for (const [id, conflict] of this.conflicts) {
      if (conflict.resolved && now - conflict.timestamp.getTime() > maxAgeMs) {
        this.conflicts.delete(id);
        removed++;
      }
    }

    // Also cleanup old history
    const cutoffTime = now - maxAgeMs;
    this.resolutionHistory = this.resolutionHistory.filter(
      (r) => r.timestamp.getTime() > cutoffTime,
    );

    return removed;
  }

}
