function __method_wrapper__() {
  compareUpdateLibraryFile(libraryItemPath, existingLibraryFile, scannedLibraryFile, libraryScan) {
    let hasChanges = false

    if (existingLibraryFile.ino !== scannedLibraryFile.ino) {
      existingLibraryFile.ino = scannedLibraryFile.ino
      hasChanges = true
    }

    for (const key in existingLibraryFile.metadata) {
      if (existingLibraryFile.metadata[key] !== scannedLibraryFile.metadata[key]) {
        if (key !== 'path' && key !== 'relPath') {
          libraryScan.addLog(LogLevel.DEBUG, `Library file "${existingLibraryFile.metadata.relPath}" for library item "${libraryItemPath}" key "${key}" changed from "${existingLibraryFile.metadata[key]}" to "${scannedLibraryFile.metadata[key]}"`)
        } else {
          libraryScan.addLog(LogLevel.DEBUG, `Library file for library item "${libraryItemPath}" key "${key}" changed from "${existingLibraryFile.metadata[key]}" to "${scannedLibraryFile.metadata[key]}"`)
        }
        existingLibraryFile.metadata[key] = scannedLibraryFile.metadata[key]
        hasChanges = true
      }
    }

    if (hasChanges) {
      existingLibraryFile.updatedAt = Date.now()
    }

    return hasChanges
  }

}
