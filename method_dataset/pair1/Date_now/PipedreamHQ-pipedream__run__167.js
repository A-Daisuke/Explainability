function __method_wrapper__() {
  async run(event) {
    event = await this.processEvent(event);

    if (event) {
      if (!event.client_msg_id) {
        event.pipedream_msg_id = `pd_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 10)}`;
      }

      this.$emit(event, {
        id: event.client_msg_id || event.pipedream_msg_id || event.channel.id,
        summary: this.getSummary(event),
        ts: event.event_ts || Date.now(),
      });
    }
  },

}
