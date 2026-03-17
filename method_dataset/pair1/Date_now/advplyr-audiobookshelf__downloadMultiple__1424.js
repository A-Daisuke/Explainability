class __C__ {
  async downloadMultiple(req, res) {
    if (!req.user.canDownload) {
      Logger.warn(`User "${req.user.username}" attempted to download without permission`)
      return res.sendStatus(403)
    }

    if (!req.query.ids || typeof req.query.ids !== 'string') {
      res.status(400).send('Invalid request. ids must be a string')
      return
    }

    const itemIds = req.query.ids.split(',')

    const libraryItems = await Database.libraryItemModel.findAll({
      attributes: ['id', 'libraryId', 'path', 'isFile'],
      where: {
        id: itemIds
      }
    })

    Logger.info(`[LibraryController] User "${req.user.username}" requested download for items "${itemIds}"`)

    const filename = `LibraryItems-${Date.now()}.zip`
    const pathObjects = libraryItems.map((li) => ({ path: li.path, isFile: li.isFile }))

    if (!pathObjects.length) {
      Logger.warn(`[LibraryController] No library items found for ids "${itemIds}"`)
      return res.status(404).send('Library items not found')
    }

    try {
      await zipHelpers.zipDirectoriesPipe(pathObjects, filename, res)
      Logger.info(`[LibraryController] Downloaded ${pathObjects.length} items "${filename}"`)
    } catch (error) {
      Logger.error(`[LibraryController] Download failed for items "${filename}" at ${pathObjects.map((po) => po.path).join(', ')}`, error)
      zipHelpers.handleDownloadError(error, res)
    }
  }

}
