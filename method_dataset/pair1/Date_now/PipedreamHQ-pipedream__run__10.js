function __method_wrapper__() {
  async run(request) {
    const { payload } = this.validateRequest(request);

    if (payload.status !== STATUS_RUNNING) {
      console.log(`Deploy status [${payload.status}] is not ${STATUS_RUNNING}`);
      return;
    }

    this.$emit({
      payload,
    }, {
      id: payload.identifier,
      summary: `Started ${payload.identifier}`,
      ts: Date.now(),
    });
  },

}
