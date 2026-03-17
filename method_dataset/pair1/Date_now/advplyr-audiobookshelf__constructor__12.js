class __C__ {
  constructor(dailyLogDirPath) {
    this.id = date.format(new Date(), 'YYYY-MM-DD')

    this.dailyLogDirPath = dailyLogDirPath
    this.filename = this.id + '.txt'
    this.fullPath = Path.join(this.dailyLogDirPath, this.filename)

    this.createdAt = Date.now()

    /** @type {import('../managers/LogManager').LogObject[]} */
    this.logs = []
    /** @type {string[]} */
    this.bufferedLogLines = []

    this.locked = false
  }

}
