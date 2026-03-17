const createScreenshotNode = async ({
  url,
  parent,
  cache,
  createNode,
  createNodeId,
  getCache,
  parentNodeId,
  createContentDigest,
  pluginOptions,
}) => {
  try {
    let fileNode
    let expires
    if (USE_PLACEHOLDER_IMAGE) {
      const getPlaceholderFileNode = require(`./placeholder-file-node`)
      fileNode = await getPlaceholderFileNode({
        createNode,
        createNodeId,
      })
      expires = new Date(2999, 1, 1).getTime()
    } else {
      const screenshotResponse = await axios.post(
        pluginOptions.screenshotEndpoint,
        { url }
      )

      fileNode = await createRemoteFileNode({
        url: screenshotResponse.data.url,
        cache,
        createNode,
        createNodeId,
        getCache,
        parentNodeId,
      })
      expires = screenshotResponse.data.expires

      if (!fileNode) {
        throw new Error(`Remote file node is null`, screenshotResponse.data.url)
      }
    }

    const screenshotNode = {
      id: createNodeId(`${parent} >>> Screenshot`),
      url,
      expires,
      parent,
      children: [],
      internal: {
        type: `Screenshot`,
      },
      screenshotFile___NODE: fileNode.id,
      usingPlaceholder: USE_PLACEHOLDER_IMAGE,
    }

    screenshotNode.internal.contentDigest = createContentDigest(screenshotNode)

    createNode(screenshotNode)

    return screenshotNode
  } catch (e) {
    console.log(`Failed to screenshot ${url}. Retrying...`)

    throw e
  }
}
