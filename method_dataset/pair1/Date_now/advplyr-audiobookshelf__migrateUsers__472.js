function migrateUsers(oldUsers) {
  const _newRecords = {
    user: [],
    mediaProgress: []
  }
  for (const oldUser of oldUsers) {
    //
    // Migrate User
    //
    // Convert old library ids to new ids
    const librariesAccessible = (oldUser.librariesAccessible || []).map((lid) => oldDbIdMap.libraries[lid]).filter((li) => li)

    // Convert old library item ids to new ids
    const bookmarks = (oldUser.bookmarks || [])
      .map((bm) => {
        bm.libraryItemId = oldDbIdMap.libraryItems[bm.libraryItemId]
        return bm
      })
      .filter((bm) => bm.libraryItemId)

    // Convert old series ids to new
    const seriesHideFromContinueListening = (oldUser.seriesHideFromContinueListening || [])
      .map((oldSeriesId) => {
        // Series were split to be per library
        // This will use the first series it finds
        for (const libraryId in oldDbIdMap.series) {
          if (oldDbIdMap.series[libraryId][oldSeriesId]) {
            return oldDbIdMap.series[libraryId][oldSeriesId]
          }
        }
        return null
      })
      .filter((se) => se)

    const User = {
      id: uuidv4(),
      username: oldUser.username,
      pash: oldUser.pash || null,
      type: oldUser.type || null,
      token: oldUser.token || null,
      isActive: !!oldUser.isActive,
      lastSeen: oldUser.lastSeen || null,
      extraData: {
        seriesHideFromContinueListening,
        oldUserId: oldUser.id // Used to keep old tokens
      },
      createdAt: oldUser.createdAt || Date.now(),
      permissions: {
        ...oldUser.permissions,
        librariesAccessible,
        itemTagsSelected: oldUser.itemTagsSelected || []
      },
      bookmarks
    }
    oldDbIdMap.users[oldUser.id] = User.id
    _newRecords.user.push(User)

    //
    // Migrate MediaProgress
    //
    for (const oldMediaProgress of oldUser.mediaProgress) {
      let mediaItemType = 'book'
      let mediaItemId = null
      if (oldMediaProgress.episodeId) {
        mediaItemType = 'podcastEpisode'
        mediaItemId = oldDbIdMap.podcastEpisodes[oldMediaProgress.episodeId]
      } else {
        mediaItemId = oldDbIdMap.books[oldMediaProgress.libraryItemId]
      }

      if (!mediaItemId) {
        Logger.warn(`[dbMigration] migrateUsers: Unable to find media item for media progress "${oldMediaProgress.id}"`)
        continue
      }

      const MediaProgress = {
        id: uuidv4(),
        mediaItemId,
        mediaItemType,
        duration: oldMediaProgress.duration,
        currentTime: oldMediaProgress.currentTime,
        ebookLocation: oldMediaProgress.ebookLocation || null,
        ebookProgress: oldMediaProgress.ebookProgress || null,
        isFinished: !!oldMediaProgress.isFinished,
        hideFromContinueListening: !!oldMediaProgress.hideFromContinueListening,
        finishedAt: oldMediaProgress.finishedAt,
        createdAt: oldMediaProgress.startedAt || oldMediaProgress.lastUpdate,
        updatedAt: oldMediaProgress.lastUpdate,
        userId: User.id,
        extraData: {
          libraryItemId: oldDbIdMap.libraryItems[oldMediaProgress.libraryItemId],
          progress: oldMediaProgress.progress
        }
      }
      _newRecords.mediaProgress.push(MediaProgress)
    }
  }
  return _newRecords
}
