const renderHTMLQueue = async (
  workerPool: GatsbyWorkerPool,
  activity: IActivity,
  htmlComponentRendererPath: string,
  pages: Array<string>,
  stage: Stage = Stage.BuildHTML
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

  const { webpackCompilationHash } = store.getState()

  const renderHTML =
    stage === `build-html`
      ? workerPool.single.renderHTMLProd
      : workerPool.single.renderHTMLDev

  const uniqueUnsafeBuiltinUsedStacks = new Set<string>()

  try {
    await Bluebird.map(segments, async pageSegment => {
      const renderHTMLResult = await renderHTML({
        envVars,
        htmlComponentRendererPath,
        paths: pageSegment,
        sessionId,
        webpackCompilationHash,
      })

      if (isPreview) {
        const htmlRenderMeta = renderHTMLResult as IRenderHtmlResult
        const seenErrors = new Set()
        const errorMessages = new Map()
        await Promise.all(
          Object.entries(htmlRenderMeta.previewErrors).map(
            async ([pagePath, error]) => {
              if (!seenErrors.has(error.stack)) {
                errorMessages.set(error.stack, {
                  pagePaths: [pagePath],
                })
                seenErrors.add(error.stack)
                const prettyError = createErrorFromString(
                  error.stack,
                  `${htmlComponentRendererPath}.map`
                )

                const errorMessageStr = `${prettyError.stack}${
                  prettyError.codeFrame ? `\n\n${prettyError.codeFrame}\n` : ``
                }`

                const errorMessage = errorMessages.get(error.stack)
                errorMessage.errorMessage = errorMessageStr
                errorMessages.set(error.stack, errorMessage)
              } else {
                const errorMessage = errorMessages.get(error.stack)
                errorMessage.pagePaths.push(pagePath)
                errorMessages.set(error.stack, errorMessage)
              }
            }
          )
        )

        for (const value of errorMessages.values()) {
          const errorMessage = `The following page(s) saw this error when building their HTML:\n\n${value.pagePaths
            .map(p => `- ${p}`)
            .join(`\n`)}\n\n${value.errorMessage}`
          reporter.error({
            id: `95314`,
            context: { errorMessage },
          })
        }
      }

      if (stage === `build-html`) {
        const htmlRenderMeta = renderHTMLResult as IRenderHtmlResult
        store.dispatch({
          type: `HTML_GENERATED`,
          payload: pageSegment,
        })

        if (_CFLAGS_.GATSBY_MAJOR === `5` && process.env.GATSBY_SLICES) {
          store.dispatch({
            type: `SET_SLICES_PROPS`,
            payload: htmlRenderMeta.slicesPropsPerPage,
          })
        }

        for (const [_pagePath, arrayOfUsages] of Object.entries(
          htmlRenderMeta.unsafeBuiltinsUsageByPagePath
        )) {
          for (const unsafeUsageStack of arrayOfUsages) {
            uniqueUnsafeBuiltinUsedStacks.add(unsafeUsageStack)
          }
        }
      }

      if (activity && activity.tick) {
        activity.tick(pageSegment.length)
      }
    })
  } catch (e) {
    if (e?.context?.unsafeBuiltinsUsageByPagePath) {
      for (const [_pagePath, arrayOfUsages] of Object.entries(
        e.context.unsafeBuiltinsUsageByPagePath
      )) {
        // @ts-ignore TS doesn't know arrayOfUsages is Iterable
        for (const unsafeUsageStack of arrayOfUsages) {
          uniqueUnsafeBuiltinUsedStacks.add(unsafeUsageStack)
        }
      }
    }
    throw e
  } finally {
    if (uniqueUnsafeBuiltinUsedStacks.size > 0) {
      console.warn(
        `Unsafe builtin method was used, future builds will need to rebuild all pages`
      )
      store.dispatch({
        type: `SSR_USED_UNSAFE_BUILTIN`,
      })
    }

    for (const unsafeBuiltinUsedStack of uniqueUnsafeBuiltinUsedStacks) {
      const prettyError = createErrorFromString(
        unsafeBuiltinUsedStack,
        `${htmlComponentRendererPath}.map`
      )

      const warningMessage = `${prettyError.stack}${
        prettyError.codeFrame ? `\n\n${prettyError.codeFrame}\n` : ``
      }`

      reporter.warn(warningMessage)
    }
  }
}
