class __C__ {
  static async getByFilterAndSort(library, user, options) {
    let start = Date.now()
    const { libraryItems, count } = await libraryFilters.getFilteredLibraryItems(library.id, user, options)
    Logger.debug(`Loaded ${libraryItems.length} of ${count} items for libary page in ${((Date.now() - start) / 1000).toFixed(2)}s`)

    return {
      libraryItems: libraryItems.map((li) => {
        const oldLibraryItem = li.toOldJSONMinified()
        if (li.collapsedSeries) {
          oldLibraryItem.collapsedSeries = li.collapsedSeries
        }
        if (li.series) {
          oldLibraryItem.media.metadata.series = li.series
        }
        if (li.rssFeed) {
          oldLibraryItem.rssFeed = li.rssFeed.toOldJSONMinified()
        }
        if (li.media.numEpisodes) {
          oldLibraryItem.media.numEpisodes = li.media.numEpisodes
        }
        if (li.size && !oldLibraryItem.media.size) {
          oldLibraryItem.media.size = li.size
        }
        if (li.numEpisodesIncomplete) {
          oldLibraryItem.numEpisodesIncomplete = li.numEpisodesIncomplete
        }
        if (li.mediaItemShare) {
          oldLibraryItem.mediaItemShare = li.mediaItemShare
        }

        return oldLibraryItem
      }),
      count
    }
  }

}
