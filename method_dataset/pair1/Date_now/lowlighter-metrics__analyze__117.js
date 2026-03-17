function __method_wrapper__() {
  async analyze(path, {commits = []} = {}) {
    const cache = {files: {}, languages: {}}
    const start = Date.now()
    let elapsed = 0, processed = 0
    if (this.timeout.repositories)
      this.debug(`timeout for repository analysis set to ${this.timeout.repositories}m`)
    for (const commit of commits) {
      elapsed = (Date.now() - start) / 1000 / 60
      if ((this.timeout.repositories) && (elapsed > this.timeout.repositories)) {
        this.results.partial.repositories = true
        this.debug(`reached maximum execution time of ${this.timeout.repositories}m for repository analysis (${elapsed}m elapsed)`)
        break
      }
      try {
        const {total, files, missed, lines, stats} = await this.linguist(path, {commit, cache})
        this.results.commits++
        this.results.total += total
        this.results.files += files
        this.results.missed.lines += missed.lines
        this.results.missed.bytes += missed.bytes
        for (const language in lines) {
          if (this.categories.includes(cache.languages[language]?.type))
            this.results.lines[language] = (this.results.lines[language] ?? 0) + lines[language]
        }
        for (const language in stats) {
          if (this.categories.includes(cache.languages[language]?.type))
            this.results.stats[language] = (this.results.stats[language] ?? 0) + stats[language]
        }
      }
      catch (error) {
        this.debug(`skipping commit ${commit.sha} (${error})`)
        this.results.missed.commits++
      }
      finally {
        this.results.elapsed += elapsed
        processed++
        if ((processed % 50 === 0) || (processed === commits.length))
          this.debug(`at commit ${processed}/${commits.length} (${(100 * processed / commits.length).toFixed(2)}%, ${elapsed.toFixed(2)}m elapsed)`)
      }
    }
    this.results.colors = Object.fromEntries(Object.entries(cache.languages).map(([lang, {color}]) => [lang, color]))
  }

}
