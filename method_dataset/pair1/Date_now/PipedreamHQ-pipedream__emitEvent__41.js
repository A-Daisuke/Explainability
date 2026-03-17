class __C__ {
    async emitEvent(event) {
      const { body } = event;

      if (!body || !body.events) return;

      for (const e of body.events) {
        const { data: story } = await this.asana.getStory({
          storyId: e.resource.gid,
        });

        this.$emit(story, {
          id: story.gid,
          summary: story.text,
          ts: Date.now(),
        });
      }
    },

}
