class __C__ {
  scheduleMediaItemShare(mediaItemShare) {
    if (!mediaItemShare?.expiresAt) return

    const expiresAtDuration = mediaItemShare.expiresAt.valueOf() - Date.now()
    if (expiresAtDuration <= 0) {
      Logger.warn(`[ShareManager] Attempted to schedule expired media item share "${mediaItemShare.id}"`)
      this.destroyMediaItemShare(mediaItemShare.id)
      return
    }
    const timeout = new LongTimeout()
    timeout.set(() => {
      Logger.info(`[ShareManager] Removing expired media item share "${mediaItemShare.id}"`)
      this.removeMediaItemShare(mediaItemShare.id)
    }, expiresAtDuration)
    this.openMediaItemShares.push({ id: mediaItemShare.id, mediaItemShare: mediaItemShare.toJSON(), timeout })
    Logger.info(`[ShareManager] Scheduled media item share "${mediaItemShare.id}" to expire in ${elapsedPretty(expiresAtDuration / 1000)}`)
  }

}
