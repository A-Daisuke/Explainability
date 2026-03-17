class __C__ {
  async updateMediaItemShareProgress(req, res) {
    if (!req.cookies.share_session_id) {
      return res.status(404).send('Share session not set')
    }

    const { slug } = req.params
    const { currentTime } = req.body
    if (currentTime === null || isNaN(currentTime) || currentTime < 0) {
      return res.status(400).send('Invalid current time')
    }

    const mediaItemShare = ShareManager.findBySlug(slug)
    if (!mediaItemShare) {
      return res.status(404)
    }

    const playbackSession = ShareManager.findPlaybackSessionBySessionId(req.cookies.share_session_id)
    if (!playbackSession || playbackSession.mediaItemShareId !== mediaItemShare.id) {
      return res.status(404).send('Share session not found')
    }

    playbackSession.currentTime = Math.min(currentTime, playbackSession.duration)
    playbackSession.updatedAt = Date.now()
    Logger.debug(`[ShareController] Update share playback session ${req.cookies.share_session_id} currentTime: ${playbackSession.currentTime}`)
    res.sendStatus(204)
  }

}
