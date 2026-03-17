function __method_wrapper__() {
    async onWebhookTrigger(event) {
      const {
        body, headers,
      } = event;
      const action = body?.action;
      if (action && this.checkEventType(action)) {
        const item = this.getBodyItem(body);
        const ts = new Date(item.updated_at).valueOf() || Date.now();
        const id = `${action}_${ts}`;
        const summary = this.getSummary(action, item);

        this.$emit({
          ...body,
          ...getRelevantHeaders(headers),
        }, {
          id,
          summary,
          ts,
        });
      }
    },

}
