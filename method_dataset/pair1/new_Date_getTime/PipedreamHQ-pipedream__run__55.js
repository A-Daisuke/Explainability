class __C__ {
  async run() {
    const lastShotId = this._getLastShotId();

    let page = 1;

    while (true) {
      const lastSyncTime = this._getLastSyncTime();

      this._setLastSyncTime(new Date().getTime());

      const shots = await this.dribbble.getShots({
        params: {
          page: page,
          per_page: 100,
        },
      });

      shots.filter((shot) => Date.parse(shot.published_at) > lastSyncTime).forEach(this.emitEvent);

      this._setLastShotId(shots[0].id);

      if (
        shots.length < 100 ||
        shots.filter((shot) => shot.id === lastShotId).length
      ) {
        return;
      }

      page++;
    }
  },

}
