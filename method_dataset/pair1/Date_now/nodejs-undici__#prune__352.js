function __method_wrapper__() {
  #prune () {
    if (Number.isFinite(this.#maxCount) && this.size <= this.#maxCount) {
      return 0
    }

    {
      const removed = this.#deleteExpiredValuesQuery.run(Date.now()).changes
      if (removed) {
        return removed
      }
    }

    {
      const removed = this.#deleteOldValuesQuery?.run(Math.max(Math.floor(this.#maxCount * 0.1), 1)).changes
      if (removed) {
        return removed
      }
    }

    return 0
  }

}
