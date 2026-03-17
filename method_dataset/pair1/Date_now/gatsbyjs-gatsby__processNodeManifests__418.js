export async function processNodeManifests(): Promise<Map<
  string,
  string
> | null> {
  const verboseLogs =
    process.env.gatsby_log_level === `verbose` ||
    process.env.VERBOSE_NODE_MANIFEST === `true`

  const startTime = Date.now()
  let { nodeManifests } = store.getState()

  const totalManifests = nodeManifests.length

  if (totalManifests === 0) {
    return null
  }

  let totalProcessedManifests = 0
  let totalFailedManifests = 0
  const nodeManifestPagePathMap: Map<string, string> = new Map()
  const listOfUniqueErrorIds: Set<string> = new Set()
  const previouslyWrittenNodeManifests: PreviouslyWrittenNodeManifests =
    new Map()

  async function processNodeManifestTask(
    manifest: INodeManifest,
    cb: fastq.done<any>
  ): Promise<void> {
    const processedManifest = await processNodeManifest(
      manifest,
      listOfUniqueErrorIds,
      nodeManifestPagePathMap,
      verboseLogs,
      previouslyWrittenNodeManifests
    )

    if (processedManifest) {
      totalProcessedManifests++
    } else {
      totalFailedManifests++
    }

    // `setImmediate` below is a workaround against stack overflow
    // occurring when there are many manifests
    setImmediate(() => cb(null, true))
    return
  }

  const processNodeManifestQueue = fastq(processNodeManifestTask, 25)

  if (totalManifests > NODE_MANIFEST_FILE_LIMIT) {
    nodeManifests = [...nodeManifests]
    nodeManifests.sort(nodeManifestSortComparerAscendingUpdatedAt)
    nodeManifests = nodeManifests.slice(0, NODE_MANIFEST_FILE_LIMIT)
  }

  for (const manifest of nodeManifests) {
    processNodeManifestQueue.push(manifest, () => {})
  }

  if (!processNodeManifestQueue.idle()) {
    await new Promise(resolve => {
      processNodeManifestQueue.drain = resolve as () => unknown
    })
  }

  const pluralize = (length: number): string =>
    length > 1 || length === 0 ? `s` : ``

  const endTime = Date.now()

  reporter.info(
    `Wrote out ${totalProcessedManifests} node page manifest file${pluralize(
      totalProcessedManifests
    )} in ${endTime - startTime} ms. ${
      totalFailedManifests > 0
        ? `. ${totalFailedManifests} manifest${pluralize(
            totalFailedManifests
          )} couldn't be processed.`
        : ``
    }`
  )

  reporter.info(
    (!verboseLogs && listOfUniqueErrorIds.size > 0
      ? `unstable_createNodeManifest produced warnings [${[
          ...listOfUniqueErrorIds,
        ].join(`, `)}]. `
      : ``) +
      `To see full warning messages set process.env.VERBOSE_NODE_MANIFEST to "true".\nVisit https://gatsby.dev/nodemanifest for more info on Node Manifests.`
  )

  // clean up all pending manifests from the store
  store.dispatch(internalActions.deleteNodeManifests())
  return nodeManifestPagePathMap
}
