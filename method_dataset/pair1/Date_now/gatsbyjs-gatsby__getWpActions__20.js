export const getWpActions = async ({
  variables,
  helpers,
  throwFetchErrors = false,
  throwGqlErrors = false,
}) => {
  const sourceTime = Date.now()

  // @todo add pagination in case there are more than 100 actions since the last build
  const actionMonitorActions = await paginatedWpNodeFetch({
    contentTypePlural: `actionMonitorActions`,
    query: actionMonitorQuery,
    nodeTypeName: `ActionMonitor`,
    helpers,
    throwFetchErrors,
    throwGqlErrors,
    ...variables,
  })

  if (!actionMonitorActions || !actionMonitorActions.length) {
    return []
  }

  await helpers.cache.set(withPluginKey(LAST_COMPLETED_SOURCE_TIME), sourceTime)

  return actionMonitorActions
}
