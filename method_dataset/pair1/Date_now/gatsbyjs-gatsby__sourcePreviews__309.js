export const sourcePreviews = async (helpers: GatsbyHelpers): Promise<void> => {
  const { webhookBody, reporter, actions } = helpers
  const {
    debug: { preview: inPreviewDebugModeOption },
    url,
  } = getPluginOptions()

  // some versions of WPGatsby don't send a remoteUrl on every webhook.
  // if we check this for every webhookBody errors will occur!
  if (webhookBody.remoteUrl) {
    // check if we're receiving preview data fromt the right WP backend
    const { hostname: settingsHostname } = urlUtil.parse(url)
    const { hostname: remoteHostname } = urlUtil.parse(webhookBody.remoteUrl)

    if (settingsHostname !== remoteHostname) {
      const sendPreviewStatus = createPreviewStatusCallback({
        previewData: webhookBody,
        reporter,
      })

      await sendPreviewStatus({
        status: `RECEIVED_PREVIEW_DATA_FROM_WRONG_URL`,
        context: `check that the preview data came from the right URL.`,
        passedNode: {
          modified: webhookBody.modified,
          databaseId: webhookBody.parentDatabaseId,
        },
        graphqlEndpoint: webhookBody.remoteUrl,
      })

      reporter.warn(
        formatLogMessage(
          `Received preview data from a different remote URL than the one specified in plugin options. Preview will not work. Please send preview requests from the WP instance configured in gatsby-config.js.\n\n ${chalk.bold(
            `Remote URL:`
          )} ${webhookBody.remoteUrl}\n ${chalk.bold(
            `Plugin options URL:`
          )} ${url}\n\n`
        )
      )

      return
    }
  }

  const inPreviewDebugMode =
    inPreviewDebugModeOption || process.env.WP_GATSBY_PREVIEW_DEBUG

  if (inPreviewDebugMode) {
    reporter.info(`Sourcing previews for the following webhook:`)
    dump(webhookBody)
  }

  const wpGatsbyPreviewNodeManifestsAreSupported =
    await remoteSchemaSupportsFieldNameOnTypeName({
      typeName: `GatsbyPreviewData`,
      fieldName: `manifestIds`,
    })

  const previewActions = await paginatedWpNodeFetch({
    contentTypePlural: `actionMonitorActions`,
    nodeTypeName: `ActionMonitor`,
    headers: {
      WPGatsbyPreview: webhookBody.token,
      WPGatsbyPreviewUser: webhookBody.userDatabaseId,
    },
    helpers,
    query: /* GraphQL */ `
      query PREVIEW_ACTIONS($after: String) {
        actionMonitorActions(
          where: {
            previewStream: true
            status: PRIVATE
            orderby: { field: MODIFIED, order: DESC }
            sinceTimestamp: ${
              // only source previews made in the last 60 minutes
              // We delete every preview action we process so this accounts for very long cold builds between previews.
              Date.now() - 1000 * 60 * 60
            }
          }
          first: 100
          after: $after
        ) {
          nodes {
            previewData {
              id
              isDraft
              modified
              parentDatabaseId
              previewDatabaseId
              remoteUrl
              singleName
              userDatabaseId
              ${wpGatsbyPreviewNodeManifestsAreSupported ? `manifestIds` : ``}
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  })

  if (!previewActions?.length) {
    if (inPreviewDebugMode) {
      reporter.info(
        `Preview for id ${webhookBody?.id} returned no action monitor actions.`
      )
    }
    return
  }

  if (inPreviewDebugMode) {
    reporter.info(
      `Preview for id ${webhookBody?.id} returned the following actions:`
    )
    dump(previewActions)
  }

  const queue = getPreviewQueue()

  for (const { previewData } of previewActions) {
    queue.add(() =>
      sourcePreview({
        previewData: { ...previewData, token: webhookBody.token },
        reporter,
        actions,
      })
    )
  }

  await Promise.all([queue.onEmpty(), queue.onIdle()])

  // clean up leftover callbacks at the end to clean up anything we didn't catch elsewhere
  await invokeAndCleanupLeftoverPreviewCallbacks({
    status: `GATSBY_PREVIEW_PROCESS_ERROR`,
    context: `Starting sourcePreviews`,
  })
}
