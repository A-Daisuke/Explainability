class __C__ {
  setData(rssPodcastEpisode, libraryItem, isAutoDownload, libraryId) {
    this.id = uuidv4()
    this.rssPodcastEpisode = rssPodcastEpisode

    const url = rssPodcastEpisode.enclosure.url
    if (decodeURIComponent(url) !== url) {
      // Already encoded
      this.url = url
    } else {
      this.url = encodeURI(url)
    }

    this.targetFilename = this.getSanitizedFilename(this.rssPodcastEpisode.title || '')

    this.libraryItem = libraryItem
    this.isAutoDownload = isAutoDownload
    this.createdAt = Date.now()
    this.libraryId = libraryId
  }

}
