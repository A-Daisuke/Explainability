class __C__ {
  async scan(library, forceRescan = false) {
    if (this.isLibraryScanning(library.id)) {
      Logger.error(`[LibraryScanner] Already scanning ${library.id}`)
      return
    }

    if (!library.libraryFolders.length) {
      Logger.warn(`[LibraryScanner] Library has no folders to scan "${library.name}"`)
      return
    }

    const metadataPrecedence = library.settings.metadataPrecedence || Database.libraryModel.defaultMetadataPrecedence
    if (library.isBook && metadataPrecedence.join() !== library.lastScanMetadataPrecedence.join()) {
      const lastScanMetadataPrecedence = library.lastScanMetadataPrecedence?.join() || 'Unset'
      Logger.info(`[LibraryScanner] Library metadata precedence changed since last scan. From [${lastScanMetadataPrecedence}] to [${metadataPrecedence.join()}]`)
      forceRescan = true
    }

    const libraryScan = new LibraryScan()
    libraryScan.setData(library)
    libraryScan.verbose = true
    this.librariesScanning.push(libraryScan.libraryId)

    const taskData = {
      libraryId: library.id,
      libraryName: library.name,
      libraryMediaType: library.mediaType
    }
    const taskTitleString = {
      text: `Scanning "${library.name}" library`,
      key: 'MessageTaskScanningLibrary',
      subs: [library.name]
    }
    const task = TaskManager.createAndAddTask('library-scan', taskTitleString, null, true, taskData)

    Logger.info(`[LibraryScanner] Starting${forceRescan ? ' (forced)' : ''} library scan ${libraryScan.id} for ${libraryScan.libraryName}`)

    try {
      const canceled = await this.scanLibrary(libraryScan, forceRescan)
      libraryScan.setComplete()

      Logger.info(`[LibraryScanner] Library scan "${libraryScan.id}" ${canceled ? 'canceled after' : 'completed in'} ${libraryScan.elapsedTimestamp} | ${libraryScan.resultStats}`)

      if (!canceled) {
        library.lastScan = Date.now()
        library.lastScanVersion = packageJson.version
        if (library.isBook) {
          const newExtraData = library.extraData || {}
          newExtraData.lastScanMetadataPrecedence = metadataPrecedence
          library.extraData = newExtraData
          library.changed('extraData', true)
        }
        await library.save()
      }

      task.data.scanResults = libraryScan.scanResults
      if (canceled) {
        const taskFinishedString = {
          text: 'Task canceled by user',
          key: 'MessageTaskCanceledByUser'
        }
        task.setFinished(taskFinishedString)
      } else {
        task.setFinished(null, true)
      }
    } catch (err) {
      libraryScan.setComplete()

      Logger.error(`[LibraryScanner] Library scan ${libraryScan.id} failed after ${libraryScan.elapsedTimestamp} | ${libraryScan.resultStats}.`, err)

      task.data.scanResults = libraryScan.scanResults
      const taskFailedString = {
        text: 'Failed',
        key: 'MessageTaskFailed'
      }
      task.setFailed(taskFailedString)
    }

    if (this.cancelLibraryScan[libraryScan.libraryId]) delete this.cancelLibraryScan[libraryScan.libraryId]
    this.librariesScanning = this.librariesScanning.filter((lid) => lid !== library.id)

    TaskManager.taskFinished(task)

    libraryScan.saveLog()
  }

}
