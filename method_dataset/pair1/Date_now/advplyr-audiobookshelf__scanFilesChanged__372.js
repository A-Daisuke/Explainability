class __C__ {
  async scanFilesChanged(fileUpdates, pendingTask) {
    if (!fileUpdates?.length) return

    // If already scanning files from watcher then add these updates to queue
    if (this.scanningFilesChanged) {
      this.pendingFileUpdatesToScan.push([fileUpdates, pendingTask])
      Logger.debug(`[LibraryScanner] Already scanning files from watcher - file updates pushed to queue (size ${this.pendingFileUpdatesToScan.length})`)
      return
    }
    this.scanningFilesChanged = true

    const results = {
      added: 0,
      updated: 0,
      removed: 0
    }

    // files grouped by folder
    const folderGroups = this.getFileUpdatesGrouped(fileUpdates)

    for (const folderId in folderGroups) {
      const libraryId = folderGroups[folderId].libraryId

      const library = await Database.libraryModel.findByPk(libraryId, {
        include: {
          model: Database.libraryFolderModel,
          where: {
            id: folderId
          }
        }
      })
      if (!library) {
        Logger.error(`[LibraryScanner] Library "${libraryId}" not found in files changed ${libraryId}`)
        continue
      }
      const folder = library.libraryFolders[0]

      const filePathItems = folderGroups[folderId].fileUpdates.map((fileUpdate) => fileUtils.getFilePathItemFromFileUpdate(fileUpdate))
      const fileUpdateGroup = scanUtils.groupFileItemsIntoLibraryItemDirs(library.mediaType, filePathItems, !!library.settings?.audiobooksOnly, true)

      if (!Object.keys(fileUpdateGroup).length) {
        Logger.info(`[LibraryScanner] No important changes to scan for in folder "${folderId}"`)
        continue
      }
      const folderScanResults = await this.scanFolderUpdates(library, folder, fileUpdateGroup)
      Logger.debug(`[LibraryScanner] Folder scan results`, folderScanResults)

      // Tally results to share with client
      let resetFilterData = false
      Object.values(folderScanResults).forEach((scanResult) => {
        if (scanResult === ScanResult.ADDED) {
          resetFilterData = true
          results.added++
        } else if (scanResult === ScanResult.REMOVED) {
          resetFilterData = true
          results.removed++
        } else if (scanResult === ScanResult.UPDATED) {
          resetFilterData = true
          results.updated++
        }
      })

      // If something was updated then reset numIssues filter data for library
      if (resetFilterData) {
        await Database.resetLibraryIssuesFilterData(libraryId)
      }
    }

    // Complete task and send results to client
    const resultStrs = []
    if (results.added) resultStrs.push(`${results.added} added`)
    if (results.updated) resultStrs.push(`${results.updated} updated`)
    if (results.removed) resultStrs.push(`${results.removed} missing`)
    let scanResultStr = 'No changes needed'
    if (resultStrs.length) scanResultStr = resultStrs.join(', ')

    pendingTask.data.scanResults = {
      ...results,
      text: scanResultStr,
      elapsed: Date.now() - pendingTask.startedAt
    }
    pendingTask.setFinished(null, true)
    TaskManager.taskFinished(pendingTask)

    this.scanningFilesChanged = false

    if (this.pendingFileUpdatesToScan.length) {
      Logger.debug(`[LibraryScanner] File updates finished scanning with more updates in queue (${this.pendingFileUpdatesToScan.length})`)
      this.scanFilesChanged(...this.pendingFileUpdatesToScan.shift())
    }
  }

}
