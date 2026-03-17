function __method_wrapper__() {
  async run(event) {
    this.checkHmac(
      event.bodyRaw,
      event.headers["x-savvycal-signature"],
    );

    if (this.webhookEventTypes.indexOf(event.body.type) === -1) {
      console.log("Ignoring event of type", event.body.type);
      return;
    }
    this.$emit(event.body,  {
      summary: `${event.body.type} - ${event.body.id}`,
      id: event.body.id,
      ts: event.body.occurred_at || Date.now(),
    });
  },

}
