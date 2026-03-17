function __method_wrapper__() {
  private cleanup(): void {
    const now = Date.now();

    // Clean up stale wait requests
    for (const [resourceId, queue] of this.waitQueue) {
      const filtered = queue.filter((req) => {
        const age = now - req.timestamp.getTime();
        if (age > this.config.resourceTimeout) {
          this.logger.warn('Removing stale resource request', {
            resourceId,
            agentId: req.agentId,
            age,
          });
          return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        this.waitQueue.delete(resourceId);
      } else {
        this.waitQueue.set(resourceId, filtered);
      }
    }

    // Clean up locks held too long
    for (const [resourceId, agentId] of this.locks) {
      const resource = this.resources.get(resourceId);
      if (resource?.lockedAt) {
        const lockAge = now - resource.lockedAt.getTime();
        if (lockAge > this.config.resourceTimeout * 2) {
          this.logger.warn('Force releasing stale lock', {
            resourceId,
            agentId,
            lockAge,
          });
          this.unlockResource(resourceId, agentId);
        }
      }
    }
  }

}
