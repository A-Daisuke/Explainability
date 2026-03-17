function __method_wrapper__() {
    async fetchEvents() {
      // Get streamer id
      const res = await this.twitch.getMultipleUsers({
        login: this.streamer,
      });
      if (!res.data.data || res.data.data.length == 0) {
        console.log(`No streamer found with the name "${this.streamer}"`);
        return;
      }

      const lastEvent = this.getLastEvent();
      const params = {
        broadcaster_id: res.data.data[0].id,
        started_at: lastEvent
          ? new Date(lastEvent)
          : new Date(),
      };

      const clips = await this.paginate(
        this.twitch.getClips.bind(this),
        params,
        this.max,
      );
      for await (const clip of clips) {
        this.$emit(clip, this.getMeta(clip));
      }

      this.setLastEvent(Date.now());
    },

}
