function __method_wrapper__() {
  async run() {
    const newDate = Date.now();
    const lastDate = this._getLastDate();

    const { cloudId } = this;
    const requests = await this.jiraServiceDesk.getCustomerRequests({
      cloudId,
    });

    requests
      ?.filter?.((req) => this.getRequestDate(req) > lastDate)
      .forEach((req) => {
        const ts = this.getRequestDate(req);
        const id = req.issueId + ts.toString();
        const summary =
          req.requestFieldValues.find(({ fieldId }) => fieldId === "summary")
            ?.value ?? req.issueKey;
        this.$emit(req, {
          id,
          summary: `${this.getSummary()}: ${summary}`,
          ts,
        });
      });

    this._setLastDate(newDate);
  },

}
