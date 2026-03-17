const renderPartialHydrationQueue = async (
  workerPool: GatsbyWorkerPool,
  activity: IActivity,
  pages: Array<string>,
  program: IProgram
): Promise<void> => {
  // We need to only pass env vars that are set programmatically in gatsby-cli
  // to child process. Other vars will be picked up from environment.
  const envVars: Array<[string, string | undefined]> = [
    [`NODE_ENV`, process.env.NODE_ENV],
    [`gatsby_executing_command`, process.env.gatsby_executing_command],
    [`gatsby_log_level`, process.env.gatsby_log_level],
  ]

  const segments = chunk(pages, 50)
  const sessionId = Date.now()

  const { config } = store.getState()
  const { assetPrefix, pathPrefix } = config

  // Let the error bubble up
  await Promise.all(
    segments.map(async pageSegment => {
      await workerPool.single.renderPartialHydrationProd({
        envVars,
        paths: pageSegment,
        sessionId,
        pathPrefix: getPublicPath({ assetPrefix, pathPrefix, ...program }),
      })

      if (activity && activity.tick) {
        activity.tick(pageSegment.length)
      }
    })
  )
}
