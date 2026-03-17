function __method_wrapper__() {
  async createBookmark(libraryItemId, time, title) {
    const existingBookmark = this.findBookmark(libraryItemId, time)
    if (existingBookmark) {
      Logger.warn('[User] Create Bookmark already exists for this time')
      if (existingBookmark.title !== title) {
        existingBookmark.title = title
        this.changed('bookmarks', true)
        await this.save()
      }
      return existingBookmark
    }

    const newBookmark = {
      libraryItemId,
      time,
      title,
      createdAt: Date.now()
    }
    this.bookmarks.push(newBookmark)
    this.changed('bookmarks', true)
    await this.save()
    return newBookmark
  }

}
