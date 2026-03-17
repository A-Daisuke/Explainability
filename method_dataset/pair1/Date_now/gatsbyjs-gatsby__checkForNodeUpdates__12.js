const checkForNodeUpdates = async ({ cache, emitter }) => {
  // pause polling until we know wether or not there are new actions
  // if there aren't any we will unpause below, if there are some we will unpause
  // at the end of sourceNodes (triggered by WEBHOOK_RECEIVED below)
  getStore().dispatch.develop.pauseRefreshPolling()

  // get the last sourced time
  const lastCompletedSourceTime = await cache.get(
    withPluginKey(LAST_COMPLETED_SOURCE_TIME)
  )
  const since = lastCompletedSourceTime - 500

  // make a graphql request for any actions that have happened since
  const {
    data: {
      actionMonitorActions: { nodes: newActions },
    },
  } = await fetchGraphql({
    query: contentPollingQuery,
    variables: {
      since,
    },
    // throw fetch errors and graphql errors so we can auto recover in refetcher()
    throwGqlErrors: true,
    throwFetchErrors: true,
  })

  if (newActions.length) {
    emitter.emit(`WEBHOOK_RECEIVED`, {
      webhookBody: {
        since,
        refreshing: true,
      },
      pluginName: `gatsby-source-wordpress`,
    })
  } else {
    // set new last completed source time and move on
    await cache.set(withPluginKey(LAST_COMPLETED_SOURCE_TIME), Date.now())
    getStore().dispatch.develop.resumeRefreshPolling()
  }
}
