function __method_wrapper__() {
  static async getPersonalizedShelves(library, user, include, limit) {
    const fullStart = Date.now() // Used for testing load times

    const shelves = []

    // "Continue Listening" shelf
    const itemsInProgressPayload = await libraryFilters.getMediaItemsInProgress(library, user, include, limit, false)
    if (itemsInProgressPayload.items.length) {
      const ebookOnlyItemsInProgress = itemsInProgressPayload.items.filter((li) => li.media.ebookFormat && !li.media.numTracks)
      const audioItemsInProgress = itemsInProgressPayload.items.filter((li) => li.media.numTracks || li.mediaType === 'podcast')

      if (audioItemsInProgress.length) {
        shelves.push({
          id: 'continue-listening',
          label: 'Continue Listening',
          labelStringKey: 'LabelContinueListening',
          type: library.isPodcast ? 'episode' : 'book',
          entities: audioItemsInProgress,
          total: itemsInProgressPayload.count
        })
      }

      if (ebookOnlyItemsInProgress.length) {
        // "Continue Reading" shelf
        shelves.push({
          id: 'continue-reading',
          label: 'Continue Reading',
          labelStringKey: 'LabelContinueReading',
          type: 'book',
          entities: ebookOnlyItemsInProgress,
          total: itemsInProgressPayload.count
        })
      }
    }
    Logger.debug(`Loaded ${itemsInProgressPayload.items.length} of ${itemsInProgressPayload.count} items for "Continue Listening/Reading" in ${((Date.now() - fullStart) / 1000).toFixed(2)}s`)

    let start = Date.now()
    if (library.isBook) {
      start = Date.now()
      // "Continue Series" shelf
      const continueSeriesPayload = await libraryFilters.getLibraryItemsContinueSeries(library, user, include, limit)
      if (continueSeriesPayload.libraryItems.length) {
        shelves.push({
          id: 'continue-series',
          label: 'Continue Series',
          labelStringKey: 'LabelContinueSeries',
          type: 'book',
          entities: continueSeriesPayload.libraryItems,
          total: continueSeriesPayload.count
        })
      }
      Logger.debug(`Loaded ${continueSeriesPayload.libraryItems.length} of ${continueSeriesPayload.count} items for "Continue Series" in ${((Date.now() - start) / 1000).toFixed(2)}s`)
    } else if (library.isPodcast) {
      // "Newest Episodes" shelf
      const newestEpisodesPayload = await libraryFilters.getNewestPodcastEpisodes(library, user, limit)
      if (newestEpisodesPayload.libraryItems.length) {
        shelves.push({
          id: 'newest-episodes',
          label: 'Newest Episodes',
          labelStringKey: 'LabelNewestEpisodes',
          type: 'episode',
          entities: newestEpisodesPayload.libraryItems,
          total: newestEpisodesPayload.count
        })
      }
      Logger.debug(`Loaded ${newestEpisodesPayload.libraryItems.length} of ${newestEpisodesPayload.count} episodes for "Newest Episodes" in ${((Date.now() - start) / 1000).toFixed(2)}s`)
    }

    start = Date.now()
    // "Recently Added" shelf
    const mostRecentPayload = await libraryFilters.getLibraryItemsMostRecentlyAdded(library, user, include, limit)
    if (mostRecentPayload.libraryItems.length) {
      shelves.push({
        id: 'recently-added',
        label: 'Recently Added',
        labelStringKey: 'LabelRecentlyAdded',
        type: library.mediaType,
        entities: mostRecentPayload.libraryItems,
        total: mostRecentPayload.count
      })
    }
    Logger.debug(`Loaded ${mostRecentPayload.libraryItems.length} of ${mostRecentPayload.count} items for "Recently Added" in ${((Date.now() - start) / 1000).toFixed(2)}s`)

    if (library.isBook) {
      start = Date.now()
      // "Recent Series" shelf
      const seriesMostRecentPayload = await libraryFilters.getSeriesMostRecentlyAdded(library, user, include, 5)
      if (seriesMostRecentPayload.series.length) {
        shelves.push({
          id: 'recent-series',
          label: 'Recent Series',
          labelStringKey: 'LabelRecentSeries',
          type: 'series',
          entities: seriesMostRecentPayload.series,
          total: seriesMostRecentPayload.count
        })
      }
      Logger.debug(`Loaded ${seriesMostRecentPayload.series.length} of ${seriesMostRecentPayload.count} series for "Recent Series" in ${((Date.now() - start) / 1000).toFixed(2)}s`)

      start = Date.now()
      // "Discover" shelf
      const discoverLibraryItemsPayload = await libraryFilters.getLibraryItemsToDiscover(library, user, include, limit)
      if (discoverLibraryItemsPayload.libraryItems.length) {
        shelves.push({
          id: 'discover',
          label: 'Discover',
          labelStringKey: 'LabelDiscover',
          type: library.mediaType,
          entities: discoverLibraryItemsPayload.libraryItems,
          total: discoverLibraryItemsPayload.count
        })
      }
      Logger.debug(`Loaded ${discoverLibraryItemsPayload.libraryItems.length} of ${discoverLibraryItemsPayload.count} items for "Discover" in ${((Date.now() - start) / 1000).toFixed(2)}s`)
    }

    start = Date.now()
    // "Listen Again" shelf
    const mediaFinishedPayload = await libraryFilters.getMediaFinished(library, user, include, limit)
    if (mediaFinishedPayload.items.length) {
      const ebookOnlyItemsInProgress = mediaFinishedPayload.items.filter((li) => li.media.ebookFormat && !li.media.numTracks)
      const audioItemsInProgress = mediaFinishedPayload.items.filter((li) => li.media.numTracks || li.mediaType === 'podcast')

      if (audioItemsInProgress.length) {
        shelves.push({
          id: 'listen-again',
          label: 'Listen Again',
          labelStringKey: 'LabelListenAgain',
          type: library.isPodcast ? 'episode' : 'book',
          entities: audioItemsInProgress,
          total: mediaFinishedPayload.count
        })
      }

      // "Read Again" shelf
      if (ebookOnlyItemsInProgress.length) {
        shelves.push({
          id: 'read-again',
          label: 'Read Again',
          labelStringKey: 'LabelReadAgain',
          type: 'book',
          entities: ebookOnlyItemsInProgress,
          total: mediaFinishedPayload.count
        })
      }
    }
    Logger.debug(`Loaded ${mediaFinishedPayload.items.length} of ${mediaFinishedPayload.count} items for "Listen/Read Again" in ${((Date.now() - start) / 1000).toFixed(2)}s`)

    if (library.isBook) {
      start = Date.now()
      // "Newest Authors" shelf
      const newestAuthorsPayload = await libraryFilters.getNewestAuthors(library, user, limit)
      if (newestAuthorsPayload.authors.length) {
        shelves.push({
          id: 'newest-authors',
          label: 'Newest Authors',
          labelStringKey: 'LabelNewestAuthors',
          type: 'authors',
          entities: newestAuthorsPayload.authors,
          total: newestAuthorsPayload.count
        })
      }
      Logger.debug(`Loaded ${newestAuthorsPayload.authors.length} of ${newestAuthorsPayload.count} authors for "Newest Authors" in ${((Date.now() - start) / 1000).toFixed(2)}s`)
    }

    Logger.debug(`Loaded ${shelves.length} personalized shelves in ${((Date.now() - fullStart) / 1000).toFixed(2)}s`)

    return shelves
  }

}
