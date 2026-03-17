function __method_wrapper__() {
  async acquire(resourceId: string, agentId: string, priority = 0): Promise<void> {
    this.logger.debug('Resource acquisition requested', { resourceId, agentId });

    // Check if resource exists
    if (!this.resources.has(resourceId)) {
      this.resources.set(resourceId, {
        id: resourceId,
        type: 'generic',
        locked: false,
      });
    }

    const resource = this.resources.get(resourceId)!;

    // Check if already locked by this agent
    if (this.locks.get(resourceId) === agentId) {
      this.logger.debug('Resource already locked by agent', { resourceId, agentId });
      return;
    }

    // Try to acquire lock
    if (!resource.locked) {
      await this.lockResource(resourceId, agentId);
      return;
    }

    // Add to wait queue
    const request: LockRequest = {
      agentId,
      resourceId,
      timestamp: new Date(),
      priority,
    };

    if (!this.waitQueue.has(resourceId)) {
      this.waitQueue.set(resourceId, []);
    }

    const queue = this.waitQueue.get(resourceId)!;
    queue.push(request);

    // Sort by priority and timestamp
    queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return a.timestamp.getTime() - b.timestamp.getTime(); // Earlier first
    });

    this.logger.info('Agent added to resource wait queue', {
      resourceId,
      agentId,
      queueLength: queue.length,
    });

    // Wait for resource with timeout
    const startTime = Date.now();
    while (Date.now() - startTime < this.config.resourceTimeout) {
      // Check if we're next in queue and resource is available
      const nextRequest = queue[0];
      if (nextRequest?.agentId === agentId && !resource.locked) {
        // Remove from queue and acquire
        queue.shift();
        await this.lockResource(resourceId, agentId);
        return;
      }

      // Check if our request is still in queue
      const ourRequest = queue.find((req) => req.agentId === agentId);
      if (!ourRequest) {
        // Request was removed (possibly by cleanup)
        throw new ResourceLockError('Resource request cancelled');
      }

      await delay(100);
    }

    // Timeout - remove from queue
    const index = queue.findIndex((req) => req.agentId === agentId);
    if (index !== -1) {
      queue.splice(index, 1);
    }

    throw new ResourceLockError(`Resource acquisition timeout for ${resourceId}`, {
      resourceId,
      agentId,
      timeout: this.config.resourceTimeout,
    });
  }

}
