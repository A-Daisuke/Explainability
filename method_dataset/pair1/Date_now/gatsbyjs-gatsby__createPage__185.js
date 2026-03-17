function __method_wrapper__() {
actions.createPage = (
  page: IPageInput,
  plugin?: Plugin,
  actionOptions?: ActionOptions
) => {
  let name = `The plugin "${plugin.name}"`
  if (plugin.name === `default-site-plugin`) {
    name = `Your site's "gatsby-node.js"`
  }
  if (!page.path) {
    const message = `${name} must set the page path when creating a page`
    // Don't log out when testing
    if (isNotTestEnv) {
      report.panic({
        id: `11323`,
        context: {
          pluginName: name,
          pageObject: page,
          message,
        },
      })
    } else {
      return message
    }
  }

  // Validate that the context object doesn't overlap with any core page fields
  // as this will cause trouble when running graphql queries.
  if (page.context && typeof page.context === `object`) {
    const invalidFields = reservedFields.filter(field => field in page.context)

    if (invalidFields.length > 0) {
      const error = `${
        invalidFields.length === 1
          ? `${name} used a reserved field name in the context object when creating a page:`
          : `${name} used reserved field names in the context object when creating a page:`
      }

${invalidFields.map(f => `  * "${f}"`).join(`\n`)}

${JSON.stringify(page, null, 4)}

Data in "context" is passed to GraphQL as potential arguments when running the
page query.

When arguments for GraphQL are constructed, the context object is combined with
the page object so *both* page object and context data are available as
arguments. So you don't need to add the page "path" to the context as it's
already available in GraphQL. If a context field duplicates a field already
used by the page object, this can break functionality within Gatsby so must be
avoided.

Please choose another name for the conflicting fields.

The following fields are used by the page object and should be avoided.

${reservedFields.map(f => `  * "${f}"`).join(`\n`)}

            `
      if (isTestEnv) {
        return error
        // Only error if the context version is different than the page
        // version.  People in v1 often thought that they needed to also pass
        // the path to context for it to be available in GraphQL
      } else if (invalidFields.some(f => page.context[f] !== page[f])) {
        report.panic({
          id: `11324`,
          context: {
            message: error,
          },
        })
      } else {
        if (!hasWarnedForPageComponentInvalidContext.has(page.component)) {
          report.warn(error)
          hasWarnedForPageComponentInvalidContext.add(page.component)
        }
      }
    }
  }

  // Check if a component is set.
  if (!page.component) {
    if (isNotTestEnv) {
      report.panic({
        id: `11322`,
        context: {
          input: page,
          pluginName: name,
        },
      })
    } else {
      // For test
      return `A component must be set when creating a page`
    }
  }

  const pageComponentPath = shadowCreatePagePath(page.component)
  if (pageComponentPath) {
    page.component = pageComponentPath
  }

  const { config, program } = store.getState()
  const { trailingSlash } = config
  const { directory } = program

  const { error, panicOnBuild } = validateComponent({
    input: page,
    pluginName: name,
    errorIdMap: {
      noPath: `11322`,
      notAbsolute: `11326`,
      doesNotExist: `11325`,
      empty: `11327`,
      noDefaultExport: `11328`,
    },
  })

  if (error) {
    if (isNotTestEnv) {
      if (panicOnBuild) {
        report.panicOnBuild(error)
      } else {
        report.panic(error)
      }
    }
    return `${name} must set the absolute path to the page component when creating a page`
  }

  // check if we've processed this component path
  // before, before running the expensive "trueCasePath"
  // operation
  //
  // Skip during testing as the paths don't exist on disk.
  if (isNotTestEnv) {
    if (pageComponentCache.has(page.component)) {
      page.component = pageComponentCache.get(page.component)
    } else {
      const originalPageComponent = page.component
      const splitPath = splitComponentPath(page.component)

      // normalize component path
      page.component = slash(splitPath[0])
      // check if path uses correct casing - incorrect casing will
      // cause issues in query compiler and inconsistencies when
      // developing on Mac or Windows and trying to deploy from
      // linux CI/CD pipeline
      let trueComponentPath
      try {
        // most systems
        trueComponentPath = slash(trueCasePathSync(page.component))
      } catch (e) {
        // systems where user doesn't have access to /
        const commonDir = getCommonDir(directory, page.component)

        // using `path.win32` to force case insensitive relative path
        const relativePath = slash(
          path.win32.relative(commonDir, page.component)
        )

        trueComponentPath = slash(trueCasePathSync(relativePath, commonDir))
      }

      if (isWindows) {
        page.component = ensureWindowsDriveIsUppercase(page.component)
      }

      if (trueComponentPath !== page.component) {
        if (!hasWarnedForPageComponentInvalidCasing.has(page.component)) {
          const markers = page.component
            .split(``)
            .map((letter, index) => {
              if (letter !== trueComponentPath[index]) {
                return `^`
              }
              return ` `
            })
            .join(``)

          report.warn(
            stripIndent`
          ${name} created a page with a component path that doesn't match the casing of the actual file. This may work locally, but will break on systems which are case-sensitive, e.g. most CI/CD pipelines.

          page.component:     "${page.component}"
          path in filesystem: "${trueComponentPath}"
                               ${markers}
        `
          )
          hasWarnedForPageComponentInvalidCasing.add(page.component)
        }

        page.component = trueComponentPath
      }

      if (splitPath.length > 1) {
        page.component = `${page.component}?__contentFilePath=${splitPath[1]}`
      }

      pageComponentCache.set(originalPageComponent, page.component)
    }
  }

  let internalComponentName
  if (page.path === `/`) {
    internalComponentName = `ComponentIndex`
  } else {
    internalComponentName = `Component${page.path}`
  }

  const invalidPathSegments = tooLongSegmentsInPath(page.path)

  if (invalidPathSegments.length > 0) {
    const truncatedPath = truncatePath(page.path)
    report.warn(
      report.stripIndent(`
        The path to the following page is longer than the supported limit on most
        operating systems and will cause an ENAMETOOLONG error. The path has been
        truncated to prevent this.

        Original Path: ${page.path}

        Truncated Path: ${truncatedPath}
      `)
    )
    page.path = truncatedPath
  }

  page.path = applyTrailingSlashOption(page.path, trailingSlash)

  const internalPage: Page = {
    internalComponentName,
    path: page.path,
    matchPath: page.matchPath,
    component: normalizePath(page.component),
    componentPath: normalizePath(page.component),
    componentChunkName: generateComponentChunkName(page.component),
    isCreatedByStatefulCreatePages:
      actionOptions?.traceId === `initial-createPagesStatefully`,
    // Ensure the page has a context object
    context: page.context || {},
    updatedAt: Date.now(),
    slices: page?.slices || {},

    // Link page to its plugin.
    pluginCreator___NODE: plugin.id ?? ``,
    pluginCreatorId: plugin.id ?? ``,
  }

  if (page.defer) {
    internalPage.defer = true
  }
  // Note: mode is updated in the end of the build after we get access to all page components,
  // see materializePageMode in utils/page-mode.ts
  internalPage.mode = getPageMode(internalPage)

  if (page.ownerNodeId) {
    internalPage.ownerNodeId = page.ownerNodeId
  }

  // If the path doesn't have an initial forward slash, add it.
  if (internalPage.path[0] !== `/`) {
    internalPage.path = `/${internalPage.path}`
  }

  const oldPage: Page = store.getState().pages.get(internalPage.path)
  const contextModified =
    !!oldPage && !_.isEqual(oldPage.context, internalPage.context)
  const componentModified =
    !!oldPage && !_.isEqual(oldPage.component, internalPage.component)
  const slicesModified =
    !!oldPage && !_.isEqual(oldPage.slices, internalPage.slices)

  const alternateSlashPath = page.path.endsWith(`/`)
    ? page.path.slice(0, -1)
    : page.path + `/`

  if (store.getState().pages.has(alternateSlashPath)) {
    report.warn(
      chalk.bold.yellow(`Non-deterministic routing danger: `) +
        `Attempting to create page: "${page.path}", but page "${alternateSlashPath}" already exists\n` +
        chalk.bold.yellow(
          `This could lead to non-deterministic routing behavior`
        )
    )
  }

  // just so it's easier to c&p from createPage action creator for now - ideally it's DRYed
  const { updatedAt, ...node } = internalPage
  node.children = []
  node.internal = {
    type: `SitePage`,
    contentDigest: createContentDigest(node),
  }
  node.id = `SitePage ${internalPage.path}`
  const oldNode = getNode(node.id)

  let deleteActions
  let updateNodeAction
  // marking internal-data-bridge as owner of SitePage instead of plugin that calls createPage
  if (oldNode && !hasNodeChanged(node.id, node.internal.contentDigest)) {
    updateNodeAction = {
      ...actionOptions,
      plugin: { name: `internal-data-bridge` },
      type: `TOUCH_NODE`,
      typeName: node.internal.type,
      payload: node.id,
    }
  } else {
    // Remove any previously created descendant nodes as they're all due
    // to be recreated.
    if (oldNode) {
      const createDeleteAction = node => {
        return {
          ...actionOptions,
          type: `DELETE_NODE`,
          plugin: { name: `internal-data-bridge` },
          payload: node,
          isRecursiveChildrenDelete: true,
        }
      }
      deleteActions = findChildren(oldNode.children)
        .map(getNode)
        .map(createDeleteAction)
    }

    node.internal.counter = getNextNodeCounter()

    updateNodeAction = {
      ...actionOptions,
      type: `CREATE_NODE`,
      plugin: { name: `internal-data-bridge` },
      oldNode,
      payload: node,
    }
  }

  // Sanitize page object so we don't attempt to serialize user-provided objects that are not serializable later
  const sanitizedPayload = sanitizeNode(internalPage)

  const actions = [
    {
      ...actionOptions,
      type: `CREATE_PAGE`,
      contextModified,
      componentModified,
      slicesModified,
      plugin,
      payload: sanitizedPayload,
    },
  ]

  if (deleteActions && deleteActions.length) {
    actions.push(...deleteActions)
  }

  actions.push(updateNodeAction)

  return actions
}

}
