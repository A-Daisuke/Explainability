function __method_wrapper__() {
  async flushFile(
    filePath: string,
    flushOperation: (contents: string) => Promise<boolean>
  ): Promise<boolean> {
    const now = `${Date.now()}-${process.pid}`
    let success = false
    let contents = ``
    try {
      if (!existsSync(filePath)) {
        return true
      }
      // Unique temporary file name across multiple concurrent Gatsby instances
      const newPath = `${this.bufferFilePath}-${now}`
      renameSync(filePath, newPath)
      contents = readFileSync(newPath, `utf8`)
      unlinkSync(newPath)

      // There is still a chance process dies while sending data and some events are lost
      // This will be ok for now, however
      success = await flushOperation(contents)
    } catch (e) {
      // ignore
    } finally {
      // if sending fails, we write the data back to the log
      if (!success) {
        this.appendToBuffer(contents)
      }
    }
    return true
  }

}
