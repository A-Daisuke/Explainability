function __method_wrapper__() {
  async run() {
    const lastDateSynced = this._getLastDateSynced() ?? new Date().getTime();
    this._setLastDateSynced(new Date().getTime());

    const resources = await this.getResources({
      accountId: this.accountId,
      mailboxId: this.mailboxId,
    });

    resources
      .filter((resource) => this.parseDate(resource.created_at) > lastDateSynced)
      .reverse()
      .forEach(this.emitEvent);

    if (resources.length) {
      this._setLastDateSynced(this.parseDate(resources[0].created_at));
    }
  },

}
