  const writeAndMove = (
    virtualFilePath: string,
    file: string,
    data: string
  ): Promise<void> => {
    writeModule(virtualFilePath, data)

    // files in .cache are not used anymore as part of webpack builds, but
    // still can be used by other tools (for example `gatsby serve` reads
    // `match-paths.json` to setup routing)
    const destination = joinPath(program.directory, `.cache`, file)
    const tmp = `${destination}.${Date.now()}`
    return fs
      .writeFile(tmp, data)
      .then(() => fs.move(tmp, destination, { overwrite: true }))
  }
