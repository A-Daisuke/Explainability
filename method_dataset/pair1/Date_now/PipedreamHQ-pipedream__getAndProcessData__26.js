class __C__ {
    async getAndProcessData() {
      const poll = await this.meetingpulse.getPoll({
        meetingId: this.meetingId,
        pollId: this.pollId,
      });

      const previousPollResults = this._getSavedValue();
      const results = JSON.stringify(poll.results);

      if (results !== previousPollResults) {
        const ts = Date.now();
        this.$emit(poll, {
          id: ts,
          summary: `Poll updated: ${poll.question}`,
          ts,
        });
        this._setSavedValue(results);
      }
    },

}
