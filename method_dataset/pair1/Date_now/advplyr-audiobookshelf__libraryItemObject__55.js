function __method_wrapper__() {
  get libraryItemObject() {
    let size = 0
    this.libraryFiles.forEach((lf) => size += (!isNaN(lf.metadata.size) ? Number(lf.metadata.size) : 0))
    return {
      ino: this.ino,
      path: this.path,
      relPath: this.relPath,
      mediaType: this.mediaType,
      isFile: this.isFile,
      mtime: this.mtimeMs,
      ctime: this.ctimeMs,
      birthtime: this.birthtimeMs,
      lastScan: Date.now(),
      lastScanVersion: packageJson.version,
      libraryFiles: this.libraryFiles,
      libraryId: this.libraryId,
      libraryFolderId: this.libraryFolderId,
      size
    }
  }

}
