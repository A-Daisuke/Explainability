function __method_wrapper__() {
  async run() {
    const { data: gameData } = await this.twitch.getGames([
      this.game,
    ]);
    if (gameData.length == 0) {
      console.log(`No game found with the name ${this.game}`);
      return;
    }

    // get and emit new clips of the specified game
    const lastEvent = this.getLastEvent();
    const params = {
      game_id: gameData[0].id,
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
