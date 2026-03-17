function __method_wrapper__() {
  async run(event) {
    const signature = event.headers["upstash-signature"];
    const currentSigningKey = this.db.get("currentSigningKey");
    const nextSigningKey = this.db.get("nextSigningKey");
    const url = event.url.slice(0, -1);

    try {
      await this.verify(signature, currentSigningKey, event.rawBody, url);
    } catch (e) {
      console.log(e);
      await this.verify(signature, nextSigningKey, event.rawBody, url);
    }

    await this.$emit(
      {
        event,
      },
      {
        id: event.headers["upstash-signature"],
        summary: "New webhook received from QStash",
        ts: Date.now(),
      },
    );

    await this.http.respond({
      status: 200,
    });
  },

}
