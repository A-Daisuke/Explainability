class __C__ {
  async checkLibraryItemData(existingLibraryItem, libraryScan) {
    const keysToCompare = ['libraryFolderId', 'ino', 'path', 'relPath', 'isFile']
    this.hasChanges = false
    this.hasPathChange = false
    for (const key of keysToCompare) {
      if (existingLibraryItem[key] !== this[key]) {
        libraryScan.addLog(LogLevel.DEBUG, `Library item "${existingLibraryItem.relPath}" key "${key}" changed from "${existingLibraryItem[key]}" to "${this[key]}"`)
        existingLibraryItem[key] = this[key]
        this.hasChanges = true

        if (key === 'relPath' || key === 'path') {
          this.hasPathChange = true
        }
      }
    }

    // Check mtime, ctime and birthtime
    if (existingLibraryItem.mtime?.valueOf() !== this.mtimeMs) {
      libraryScan.addLog(LogLevel.DEBUG, `Library item "${existingLibraryItem.relPath}" key "mtime" changed from "${existingLibraryItem.mtime?.valueOf()}" to "${this.mtimeMs}"`)
      existingLibraryItem.mtime = this.mtimeMs
      this.hasChanges = true
    }
    if (existingLibraryItem.birthtime?.valueOf() !== this.birthtimeMs) {
      libraryScan.addLog(LogLevel.DEBUG, `Library item "${existingLibraryItem.relPath}" key "birthtime" changed from "${existingLibraryItem.birthtime?.valueOf()}" to "${this.birthtimeMs}"`)
      existingLibraryItem.birthtime = this.birthtimeMs
      this.hasChanges = true
    }
    if (existingLibraryItem.ctime?.valueOf() !== this.ctimeMs) {
      libraryScan.addLog(LogLevel.DEBUG, `Library item "${existingLibraryItem.relPath}" key "ctime" changed from "${existingLibraryItem.ctime?.valueOf()}" to "${this.ctimeMs}"`)
      existingLibraryItem.ctime = this.ctimeMs
      this.hasChanges = true
    }
    if (existingLibraryItem.isMissing) {
      libraryScan.addLog(LogLevel.DEBUG, `Library item "${existingLibraryItem.relPath}" was missing but now found`)
      existingLibraryItem.isMissing = false
      this.hasChanges = true
    }

    this.libraryFilesRemoved = []
    this.libraryFilesModified = []
    let libraryFilesAdded = this.libraryFiles.map(lf => lf)

    for (const existingLibraryFile of existingLibraryItem.libraryFiles) {
      // Find matching library file using path first and fallback to using inode value
      let matchingLibraryFile = this.libraryFiles.find(lf => lf.metadata.path === existingLibraryFile.metadata.path)
      if (!matchingLibraryFile) {
        matchingLibraryFile = this.libraryFiles.find(lf => lf.ino === existingLibraryFile.ino)
        if (matchingLibraryFile) {
          libraryScan.addLog(LogLevel.INFO, `Library file with path "${existingLibraryFile.metadata.path}" not found, but found file with matching inode value "${existingLibraryFile.ino}" at path "${matchingLibraryFile.metadata.path}"`)
        }
      }

      if (!matchingLibraryFile) { // Library file removed
        libraryScan.addLog(LogLevel.INFO, `Library file "${existingLibraryFile.metadata.path}" was removed from library item "${existingLibraryItem.relPath}"`)
        this.libraryFilesRemoved.push(existingLibraryFile)
        existingLibraryItem.libraryFiles = existingLibraryItem.libraryFiles.filter(lf => lf !== existingLibraryFile)
        this.hasChanges = true
      } else {
        libraryFilesAdded = libraryFilesAdded.filter(lf => lf !== matchingLibraryFile)
        let existingLibraryFileBefore = structuredClone(existingLibraryFile)
        if (this.compareUpdateLibraryFile(existingLibraryItem.path, existingLibraryFile, matchingLibraryFile, libraryScan)) {
          this.libraryFilesModified.push({old: existingLibraryFileBefore, new: existingLibraryFile})
          this.hasChanges = true
        }
      }
    }

    // Log new library files found
    if (libraryFilesAdded.length) {
      this.hasChanges = true
      for (const libraryFile of libraryFilesAdded) {
        libraryScan.addLog(LogLevel.INFO, `New library file found with path "${libraryFile.metadata.path}" for library item "${existingLibraryItem.relPath}"`)
        if (libraryFile.isEBookFile) {
          // Set all new ebook files as supplementary
          libraryFile.isSupplementary = true
        }
        existingLibraryItem.libraryFiles.push(libraryFile.toJSON())
      }
    }

    this.libraryFilesAdded = libraryFilesAdded

    if (this.hasChanges) {
      existingLibraryItem.size = 0
      existingLibraryItem.libraryFiles.forEach((lf) => existingLibraryItem.size += lf.metadata.size)

      existingLibraryItem.lastScan = Date.now()
      existingLibraryItem.lastScanVersion = packageJson.version

      libraryScan.addLog(LogLevel.DEBUG, `Library item "${existingLibraryItem.relPath}" changed: [${existingLibraryItem.changed()?.join(',') || ''}]`)

      if (this.hasLibraryFileChanges) {
        existingLibraryItem.changed('libraryFiles', true)
      }
      await existingLibraryItem.save()
      return true
    }

    return false
  }

}
