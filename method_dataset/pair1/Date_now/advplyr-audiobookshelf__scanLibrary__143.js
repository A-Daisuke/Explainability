class __C__ {
  async scanLibrary(libraryScan, forceRescan) {
    // Make sure library filter data is set
    //   this is used to check for existing authors & series
    await libraryFilters.getFilterData(libraryScan.libraryMediaType, libraryScan.libraryId)

    /** @type {LibraryItemScanData[]} */
    let libraryItemDataFound = []

    // Scan each library folder
    for (let i = 0; i < libraryScan.libraryFolders.length; i++) {
      const folder = libraryScan.libraryFolders[i]
      const itemDataFoundInFolder = await this.scanFolder(libraryScan.library, folder)
      libraryScan.addLog(LogLevel.INFO, `${itemDataFoundInFolder.length} item data found in folder "${folder.path}"`)
      libraryItemDataFound = libraryItemDataFound.concat(itemDataFoundInFolder)
    }

    if (this.shouldCancelScan(libraryScan)) return true

    const existingLibraryItems = await Database.libraryItemModel.findAll({
      where: {
        libraryId: libraryScan.libraryId
      }
    })

    if (this.shouldCancelScan(libraryScan)) return true

    const libraryItemIdsMissing = []
    let libraryItemsUpdated = []
    for (const existingLibraryItem of existingLibraryItems) {
      // First try to find matching library item with exact file path
      let libraryItemData = libraryItemDataFound.find((lid) => lid.path === existingLibraryItem.path)
      if (!libraryItemData) {
        // Fallback to finding matching library item with matching inode value
        libraryItemData = libraryItemDataFound.find((lid) => ItemToItemInoMatch(lid, existingLibraryItem) || ItemToFileInoMatch(lid, existingLibraryItem) || ItemToFileInoMatch(existingLibraryItem, lid))
        if (libraryItemData) {
          libraryScan.addLog(LogLevel.INFO, `Library item with path "${existingLibraryItem.path}" was not found, but library item inode "${existingLibraryItem.ino}" was found at path "${libraryItemData.path}"`)
        }
      }

      if (!libraryItemData) {
        // Podcast folder can have no episodes and still be valid
        if (libraryScan.libraryMediaType === 'podcast' && (await fs.pathExists(existingLibraryItem.path))) {
          libraryScan.addLog(LogLevel.INFO, `Library item "${existingLibraryItem.relPath}" folder exists but has no episodes`)
        } else {
          libraryScan.addLog(LogLevel.WARN, `Library Item "${existingLibraryItem.path}" (inode: ${existingLibraryItem.ino}) is missing`)
          libraryScan.resultsMissing++
          if (!existingLibraryItem.isMissing) {
            libraryItemIdsMissing.push(existingLibraryItem.id)

            // TODO: Temporary while using old model to socket emit
            const libraryItem = await Database.libraryItemModel.getExpandedById(existingLibraryItem.id)
            if (libraryItem) {
              libraryItem.isMissing = true
              await libraryItem.save()
              libraryItemsUpdated.push(libraryItem)
            }
          }
        }
      } else {
        libraryItemDataFound = libraryItemDataFound.filter((lidf) => lidf !== libraryItemData)
        let libraryItemDataUpdated = await libraryItemData.checkLibraryItemData(existingLibraryItem, libraryScan)
        if (libraryItemDataUpdated || forceRescan) {
          if (forceRescan || libraryItemData.hasLibraryFileChanges || libraryItemData.hasPathChange) {
            const { libraryItem, wasUpdated } = await LibraryItemScanner.rescanLibraryItemMedia(existingLibraryItem, libraryItemData, libraryScan.library.settings, libraryScan)
            if (!forceRescan || wasUpdated) {
              libraryScan.resultsUpdated++
              libraryItemsUpdated.push(libraryItem)
            } else {
              libraryScan.addLog(LogLevel.DEBUG, `Library item "${existingLibraryItem.relPath}" is up-to-date`)
            }
          } else {
            libraryScan.resultsUpdated++
            // TODO: Temporary while using old model to socket emit
            const libraryItem = await Database.libraryItemModel.getExpandedById(existingLibraryItem.id)
            libraryItemsUpdated.push(libraryItem)
          }
        } else {
          libraryScan.addLog(LogLevel.DEBUG, `Library item "${existingLibraryItem.relPath}" is up-to-date`)
        }
      }

      // Emit item updates in chunks of 10 to client
      if (libraryItemsUpdated.length === 10) {
        SocketAuthority.libraryItemsEmitter('items_updated', libraryItemsUpdated)
        libraryItemsUpdated = []
      }

      if (this.shouldCancelScan(libraryScan)) return true
    }
    // Emit item updates to client
    if (libraryItemsUpdated.length) {
      SocketAuthority.libraryItemsEmitter('items_updated', libraryItemsUpdated)
    }

    // Authors and series that were removed from books should be removed if they are now empty
    await LibraryItemScanner.checkAuthorsAndSeriesRemovedFromBooks(libraryScan.libraryId, libraryScan)

    // Update missing library items
    if (libraryItemIdsMissing.length) {
      libraryScan.addLog(LogLevel.INFO, `Updating ${libraryItemIdsMissing.length} library items missing`)
      await Database.libraryItemModel.update(
        {
          isMissing: true,
          lastScan: Date.now(),
          lastScanVersion: packageJson.version
        },
        {
          where: {
            id: libraryItemIdsMissing
          }
        }
      )
    }

    if (this.shouldCancelScan(libraryScan)) return true

    // Add new library items
    if (libraryItemDataFound.length) {
      let newLibraryItems = []
      for (const libraryItemData of libraryItemDataFound) {
        const newLibraryItem = await LibraryItemScanner.scanNewLibraryItem(libraryItemData, libraryScan.library.settings, libraryScan)
        if (newLibraryItem) {
          newLibraryItems.push(newLibraryItem)

          libraryScan.resultsAdded++
        }

        // Emit new items in chunks of 10 to client
        if (newLibraryItems.length === 10) {
          SocketAuthority.libraryItemsEmitter('items_added', newLibraryItems)
          newLibraryItems = []
        }

        if (this.shouldCancelScan(libraryScan)) return true
      }
      // Emit new items to client
      if (newLibraryItems.length) {
        SocketAuthority.libraryItemsEmitter('items_added', newLibraryItems)
      }
    }

    libraryScan.addLog(LogLevel.INFO, `Scan completed. ${libraryScan.resultStats}`)
    return false
  }

}
