function __method_wrapper__() {
    async getAndProcessData(emit = false) {
      const topics = await this.meetingpulse.getTopics({
        meetingId: this.meetingId,
      });
      const savedIdeas = this._getSavedValue();

      for (const topic of Object.values(topics)) {
        const ideas = Object.values(topic.ideas)?.filter?.(
          ({ id }) => !savedIdeas.includes(id),
        );
        if (ideas?.length) {
          if (emit) {
            const ts = Date.now();
            this.$emit(topic, {
              id: topic.id + ts.toString(),
              summary: `${ideas.length} new idea${ideas.length === 1
                ? ""
                : "s"} in topic: ${
                topic.OCC ?? topic.callout ?? topic.text
              }`,
              ts,
            });
          }
          savedIdeas.push(...ideas.map(({ id }) => id));
        }
      }

      this._setSavedValue(savedIdeas);
    },

}
