class __C__ {
  async addToBatch(batchKey, item, processor) {
    if (!this.batches.has(batchKey)) {
      this.batches.set(batchKey, {
        items: [],
        processor,
        createdAt: Date.now(),
      });

      // Set timeout for this batch
      const timer = setTimeout(() => {
        this._processBatch(batchKey);
      }, this.config.maxWaitTime);

      this.timers.set(batchKey, timer);
    }

    const batch = this.batches.get(batchKey);
    batch.items.push(item);

    // Process if batch is full
    if (batch.items.length >= this.config.maxBatchSize) {
      return this._processBatch(batchKey);
    }

    return new Promise((resolve, reject) => {
      item._resolve = resolve;
      item._reject = reject;
    });
  }

}
