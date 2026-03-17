function __method_wrapper__() {
    beforeEach(() => {
      global.isWin = process.platform === 'win32'

      // Mock file structure with normalized paths
      const mockDirContents = new Map([
        ['/test', ['file1.mp3', 'subfolder', 'ignoreme', 'ignoremenot.mp3', 'temp.mp3.tmp']],
        ['/test/subfolder', ['file2.m4b']],
        ['/test/ignoreme', ['.ignore', 'ignored.mp3']]
      ])

      const mockStats = new Map([
        ['/test/file1.mp3', { isDirectory: () => false, size: 1024, mtimeMs: Date.now(), ino: '1' }],
        ['/test/subfolder', { isDirectory: () => true, size: 0, mtimeMs: Date.now(), ino: '2' }],
        ['/test/subfolder/file2.m4b', { isDirectory: () => false, size: 1024, mtimeMs: Date.now(), ino: '3' }],
        ['/test/ignoreme', { isDirectory: () => true, size: 0, mtimeMs: Date.now(), ino: '4' }],
        ['/test/ignoreme/.ignore', { isDirectory: () => false, size: 0, mtimeMs: Date.now(), ino: '5' }],
        ['/test/ignoreme/ignored.mp3', { isDirectory: () => false, size: 1024, mtimeMs: Date.now(), ino: '6' }],
        ['/test/ignoremenot.mp3', { isDirectory: () => false, size: 1024, mtimeMs: Date.now(), ino: '7' }],
        ['/test/temp.mp3.tmp', { isDirectory: () => false, size: 1024, mtimeMs: Date.now(), ino: '8' }]
      ])

      // Stub fs.readdir
      readdirStub = sinon.stub(fs, 'readdir')
      readdirStub.callsFake((path, callback) => {
        const contents = mockDirContents.get(path)
        if (contents) {
          callback(null, contents)
        } else {
          callback(new Error(`ENOENT: no such file or directory, scandir '${path}'`))
        }
      })

      // Stub fs.realpath
      realpathStub = sinon.stub(fs, 'realpath')
      realpathStub.callsFake((path, callback) => {
        // Return normalized path
        callback(null, fileUtils.filePathToPOSIX(path).replace(/\/$/, ''))
      })

      // Stub fs.stat
      statStub = sinon.stub(fs, 'stat')
      statStub.callsFake((path, callback) => {
        const normalizedPath = fileUtils.filePathToPOSIX(path).replace(/\/$/, '')
        const stats = mockStats.get(normalizedPath)
        if (stats) {
          callback(null, stats)
        } else {
          callback(new Error(`ENOENT: no such file or directory, stat '${normalizedPath}'`))
        }
      })

      // Stub Logger
      sinon.stub(Logger, 'debug')
    })

}
