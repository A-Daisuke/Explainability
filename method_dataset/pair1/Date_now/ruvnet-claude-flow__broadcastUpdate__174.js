class __C__ {
  broadcastUpdate(viewName, updateData) {
    const queue = this.updateQueues.get(viewName);
    if (!queue) return;

    // Add update to queue
    queue.push({
      ...updateData,
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    });

    // Schedule batched update
    this.scheduleBatchedUpdate(viewName);

    this.updateMetrics.totalUpdates++;
  }

}
