function __method_wrapper__() {
  async run() {
    const eventTypes = this.eventTypes.includes("*")
      ? options.ALL_EVENT_TYPES
      : this.eventTypes;

    const transactions = await this.yfs.getLeagueTransactions(this.league, eventTypes);
    if (Object.keys(transactions).length === 0) {
      return;
    }

    for (const txn of transactions) {
      txn._summary = this.yfs.transactionSummary(txn);
      this.$emit(txn, {
        id: txn.transaction_key,
        ts: (+txn.timestamp) * 1000,
        summary: txn._summary,
      });
    }
  },

}
