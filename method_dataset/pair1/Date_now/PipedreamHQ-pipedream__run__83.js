class __C__ {
  async run(event) {
    this.$emit(
      {
        event,
      },
      {
        summary: `New interaction event${
          event?.channel?.id
            ? ` in channel ${event.channel.id}`
            : ""
        }${
          event.actions?.length > 0
            ? ` from action_ids ${event.actions
              .map((action) => action.action_id)
              .join(", ")}`
            : ""
        }`,
        ts: Date.now(),
      },
    );
  },

}
