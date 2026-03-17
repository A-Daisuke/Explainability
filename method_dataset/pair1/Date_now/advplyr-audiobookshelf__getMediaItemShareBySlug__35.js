class __C__ {
  async getMediaItemShareBySlug(req, res) {
    const { slug } = req.params
    // Optional start time
    let startTime = req.query.t && !isNaN(req.query.t) ? Math.max(0, parseInt(req.query.t)) : 0

    const mediaItemShare = ShareManager.findBySlug(slug)
    if (!mediaItemShare) {
      Logger.warn(`[ShareController] Media item share not found with slug ${slug}`)
      return res.sendStatus(404)
    }
    if (mediaItemShare.expiresAt && mediaItemShare.expiresAt.valueOf() < Date.now()) {
      ShareManager.removeMediaItemShare(mediaItemShare.id)
      return res.status(404).send('Media item share not found')
    }

    if (req.cookies.share_session_id) {
      const playbackSession = ShareManager.findPlaybackSessionBySessionId(req.cookies.share_session_id)

      if (playbackSession) {
        if (mediaItemShare.id === playbackSession.mediaItemShareId) {
          Logger.debug(`[ShareController] Found share playback session ${req.cookies.share_session_id}`)
          mediaItemShare.playbackSession = playbackSession.toJSONForClient()
          return res.json(mediaItemShare)
        } else {
          // Changed media item share - close other session
          Logger.debug(`[ShareController] Other playback session is already open for share session. Closing session "${playbackSession.displayTitle}"`)
          ShareManager.closeSharePlaybackSession(playbackSession)
        }
      } else {
        Logger.info(`[ShareController] Share playback session not found with id ${req.cookies.share_session_id}`)
        if (!uuid.validate(req.cookies.share_session_id) || uuid.version(req.cookies.share_session_id) !== 4) {
          Logger.warn(`[ShareController] Invalid share session id ${req.cookies.share_session_id}`)
          res.clearCookie('share_session_id')
        }
      }
    }

    try {
      const libraryItem = await Database.mediaItemShareModel.getMediaItemsLibraryItem(mediaItemShare.mediaItemId, mediaItemShare.mediaItemType)
      if (!libraryItem) {
        return res.status(404).send('Media item not found')
      }

      let startOffset = 0
      const publicTracks = libraryItem.media.includedAudioFiles.map((audioFile) => {
        const audioTrack = {
          index: audioFile.index,
          startOffset,
          duration: audioFile.duration,
          title: audioFile.metadata.filename || '',
          contentUrl: `${global.RouterBasePath}/public/share/${slug}/track/${audioFile.index}`,
          mimeType: audioFile.mimeType,
          codec: audioFile.codec || null,
          metadata: structuredClone(audioFile.metadata)
        }
        startOffset += audioTrack.duration
        return audioTrack
      })

      if (startTime > startOffset) {
        Logger.warn(`[ShareController] Start time ${startTime} is greater than total duration ${startOffset}`)
        startTime = 0
      }

      const shareSessionId = req.cookies.share_session_id || uuid.v4()
      const clientDeviceInfo = {
        clientName: 'Abs Web Share',
        deviceId: shareSessionId
      }
      const deviceInfo = await this.playbackSessionManager.getDeviceInfo(req, clientDeviceInfo)

      const newPlaybackSession = new PlaybackSession()
      newPlaybackSession.setData(libraryItem, null, 'web-share', deviceInfo, startTime)
      newPlaybackSession.audioTracks = publicTracks
      newPlaybackSession.playMethod = PlayMethod.DIRECTPLAY
      newPlaybackSession.shareSessionId = shareSessionId
      newPlaybackSession.mediaItemShareId = mediaItemShare.id
      newPlaybackSession.coverAspectRatio = libraryItem.library.settings.coverAspectRatio

      mediaItemShare.playbackSession = newPlaybackSession.toJSONForClient()
      ShareManager.addOpenSharePlaybackSession(newPlaybackSession)

      // 30 day cookie
      res.cookie('share_session_id', newPlaybackSession.shareSessionId, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true })

      res.json(mediaItemShare)
    } catch (error) {
      Logger.error(`[ShareController] Failed`, error)
      res.status(500).send('Internal server error')
    }
  }

}
