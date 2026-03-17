function __method_wrapper__() {
    async emitHistoricalEvents(messages) {
      for (const message of messages) {
        const event = await this.processEvent({
          ...message,
          subtype: message.subtype || constants.SUBTYPE.PD_HISTORY_MESSAGE,
        });
        if (event) {
          if (!event.client_msg_id) {
            event.pipedream_msg_id = `pd_${Date.now()}_${Math.random().toString(36)
              .substr(2, 10)}`;
          }

          this.$emit(event, {
            id: event.client_msg_id || event.pipedream_msg_id,
            summary: this.getSummary(event),
            ts: event.event_ts || Date.now(),
          });
        }
      }
    },

}
