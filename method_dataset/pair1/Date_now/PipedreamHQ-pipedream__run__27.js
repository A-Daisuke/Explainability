class __C__ {
  async run(event) {
    const {
      body, query,
    } = event;
    if (query["hub.challenge"]) {
      this._setChallengeToken(query["hub.challenge"]);
    }
    const challengeToken = this._getChallengeToken();

    this.httpInterface.respond({
      status: "200",
      body: challengeToken,
      headers: {
        "content-type": "application/json",
      },
    });

    if (!body) {
      return;
    }

    const entries = body?.entry || [];
    for (const entry of entries) {
      if (entry.changes && entry.changes?.length > 0) {
        const status = entry?.changes[0]?.value?.statuses
          ? entry?.changes[0]?.value?.statuses[0]?.status
          : null;
        if (status && status !== "sent") {
          continue;
        }
      }
      this.$emit(entry, {
        id: Date.now(),
        summary: "New Message Sent",
        ts: Date.now(),
      });
    }
  },

}
