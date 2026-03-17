function __method_wrapper__() {
    return new Promise((resolve, reject) => {
      const queueItem = {
        operation,
        priority,
        resolve,
        reject,
        addedAt: Date.now(),
        id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // Insert based on priority (higher priority first)
      const insertIndex = this.queue.findIndex((item) => item.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(queueItem);
      } else {
        this.queue.splice(insertIndex, 0, queueItem);
      }

      this._processQueue();
    });

}
