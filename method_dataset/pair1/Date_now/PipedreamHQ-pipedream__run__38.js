class __C__ {
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    let dateParam = body.ReceivedAt ?? body.Date ?? Date.now();
    let dateObj = new Date(dateParam);

    let msgId = body.MessageID;
    let id = `${msgId}-${dateObj.toISOString()}`;

    this.$emit(body, {
      id,
      summary: this.getSummary(body),
      ts: dateObj.valueOf(),
    });
  },

}
