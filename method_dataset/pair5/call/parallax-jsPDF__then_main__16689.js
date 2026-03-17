function __method_wrapper__() {
    return this.thenCore(onFulfilled, onRejected, function then_main(
      onFulfilled,
      onRejected
    ) {
      // Update progress while queuing, calling, and resolving `then`.
      self.updateProgress(null, null, 1, [onFulfilled]);
      return Promise.prototype.then
        .call(this, function then_pre(val) {
          self.updateProgress(null, onFulfilled);
          return val;
        })
        .then(onFulfilled, onRejected)
        .then(function then_post(val) {
          self.updateProgress(1);
          return val;
        });
    });

}
