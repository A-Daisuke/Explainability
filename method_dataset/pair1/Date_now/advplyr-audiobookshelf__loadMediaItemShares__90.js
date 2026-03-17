function __method_wrapper__() {
  async loadMediaItemShares() {
    /** @type {import('../models/MediaItemShare').MediaItemShareModel[]} */
    const mediaItemShares = await Database.models.mediaItemShare.findAll()

    for (const mediaItemShare of mediaItemShares) {
      if (mediaItemShare.expiresAt && mediaItemShare.expiresAt.valueOf() < Date.now()) {
        Logger.info(`[ShareManager] Removing expired media item share "${mediaItemShare.id}"`)
        await this.destroyMediaItemShare(mediaItemShare.id)
      } else if (mediaItemShare.expiresAt) {
        this.scheduleMediaItemShare(mediaItemShare)
      } else {
        Logger.info(`[ShareManager] Loaded permanent media item share "${mediaItemShare.id}"`)
        this.openMediaItemShares.push({
          id: mediaItemShare.id,
          mediaItemShare: mediaItemShare.toJSON()
        })
      }
    }
  }

}
