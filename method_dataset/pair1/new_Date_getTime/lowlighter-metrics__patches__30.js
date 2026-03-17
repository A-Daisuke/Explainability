function __method_wrapper__() {
  async patches() {
    //Fetch commits from recent activity
    this.debug(`fetching patches from last ${this.days || ""} days up to ${this.load || "∞"} events`)
    const commits = [], pages = Math.ceil((this.load || Infinity) / 100)
    if (this.context.mode === "repository") {
      try {
        const {data: {default_branch: branch}} = await this.rest.repos.get(this.context)
        this.context.branch = branch
        this.results.branch = branch
        this.debug(`default branch for ${this.context.owner}/${this.context.repo} is ${branch}`)
      }
      catch (error) {
        this.debug(`failed to get default branch for ${this.context.owner}/${this.context.repo} (${error})`)
      }
    }
    try {
      for (let page = 1; page <= pages; page++) {
        this.debug(`fetching events page ${page}`)
        commits.push(
          ...(await (this.context.mode === "repository" ? this.rest.activity.listRepoEvents(this.context) : this.rest.activity.listEventsForAuthenticatedUser({username: this.login, per_page: 100, page}))).data
            .filter(({type, payload}) => (type === "PushEvent") && ((this.context.mode !== "repository") || ((this.context.mode === "repository") && (payload?.ref?.includes?.(`refs/heads/${this.context.branch}`)))))
            .filter(({actor}) => (this.account === "organization") || (this.context.mode === "repository") ? true : !filters.text(actor.login, [this.login], {debug: false}))
            .filter(({repo: {name: repo}}) => !this.ignore(repo))
            .filter(({created_at}) => ((!this.days) || (new Date(created_at) > new Date(Date.now() - this.days * 24 * 60 * 60 * 1000)))),
        )
      }
    }
    catch {
      this.debug("no more page to load")
    }
    this.debug(`fetched ${commits.length} commits`)
    this.results.latest = Math.round((new Date().getTime() - new Date(commits.slice(-1).shift()?.created_at).getTime()) / (1000 * 60 * 60 * 24))
    this.results.commits = commits.length

    //Retrieve edited files and filter edited lines (those starting with +/-) from patches
    this.debug("fetching patches")
    const patches = [
      ...await Promise.allSettled(
        commits
          .flatMap(({payload}) => payload.commits)
          .filter(({committer}) => filters.text(committer?.email, this.authoring, {debug: false}))
          .map(commit => commit.url)
          .map(async commit => (await this.rest.request(commit)).data),
      ),
    ]
      .filter(({status}) => status === "fulfilled")
      .map(({value}) => value)
      .filter(({parents}) => parents.length <= 1)
      .map(({sha, commit: {message, committer}, verification, files}) => ({
        sha,
        name: `${message} (authored by ${committer.name} on ${committer.date})`,
        verified: verification?.verified ?? null,
        editions: files.map(({filename, patch = ""}) => {
          const edition = {
            path: filename,
            added: {lines: 0, bytes: 0},
            deleted: {lines: 0, bytes: 0},
            patch,
          }
          for (const line of patch.split("\n")) {
            if ((!/^[-+]/.test(line)) || (!line.trim().length))
              continue
            if (this.markers.line.test(line)) {
              const {op = "+", content = ""} = line.match(this.markers.line)?.groups ?? {}
              const size = Buffer.byteLength(content, "utf-8")
              edition[{"+": "added", "-": "deleted"}[op]].bytes += size
              edition[{"+": "added", "-": "deleted"}[op]].lines++
              continue
            }
          }
          return edition
        }),
      }))
    return patches
  }

}
