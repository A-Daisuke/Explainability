function __method_wrapper__() {
    app.get(`*`, async (req, res, next) => {
      const pathObj = findPageByPath(store.getState(), decodeURI(req.path))

      if (!pathObj) {
        return next()
      }

      const allowTimedFallback = !req.headers[`x-gatsby-wait-for-dev-ssr`]

      await appendPreloadHeaders(pathObj.path, res)

      const htmlActivity = report.phantomActivity(`building HTML for path`, {})
      htmlActivity.start()

      try {
        const { html: renderResponse, serverData } = await renderDevHTML({
          path: pathObj.path,
          page: pathObj,
          skipSsr: Object.prototype.hasOwnProperty.call(req.query, `skip-ssr`),
          store,
          allowTimedFallback,
          htmlComponentRendererPath: PAGE_RENDERER_PATH,
          directory: program.directory,
          req,
        })

        if (serverData?.headers) {
          for (const [name, value] of Object.entries(serverData.headers)) {
            res.setHeader(name, value)
          }
        }
        let statusCode = 200
        if (serverData?.status) {
          statusCode = serverData.status
        }
        res.status(statusCode).send(renderResponse)
      } catch (error) {
        // The page errored but couldn't read the page component.
        // This is a race condition when a page is deleted but its requested
        // immediately after before anything can recompile.
        if (error === `404 page`) {
          return next()
        }

        // renderDevHTML throws an error with these information
        const lineNumber = error?.line as number
        const columnNumber = error?.column as number
        const filePath = error?.filename as string
        const sourceContent = error?.sourceContent as string

        report.error({
          id: `11614`,
          context: {
            path: pathObj.path,
            filePath: filePath,
            line: lineNumber,
            column: columnNumber,
          },
        })

        const emptyResponse = {
          codeFrame: `No codeFrame could be generated`,
          sourcePosition: null,
          sourceContent: null,
        }

        if (!sourceContent || !lineNumber) {
          res.json(emptyResponse)
          return null
        }

        const codeFrame = codeFrameColumns(
          sourceContent,
          {
            start: {
              line: lineNumber,
              column: columnNumber ?? 0,
            },
          },
          {
            highlightCode: true,
          }
        )

        const message = {
          codeFrame,
          source: filePath,
          line: lineNumber,
          column: columnNumber ?? 0,
          sourceMessage: error?.message,
          stack: error?.stack,
        }

        try {
          // Generate a shell for client-only content -- for the error overlay
          const { html: clientOnlyShell } = await renderDevHTML({
            path: pathObj.path,
            page: pathObj,
            skipSsr: true,
            store,
            error: message,
            htmlComponentRendererPath: PAGE_RENDERER_PATH,
            directory: program.directory,
            req,
            allowTimedFallback,
          })

          res.send(clientOnlyShell)
        } catch (e) {
          report.error({
            id: `11616`,
            context: {
              sourceMessage: e.message,
            },
            filePath: e.filename,
            location: {
              start: {
                line: e.line,
                column: e.column,
              },
            },
          })

          const minimalHTML = `<head><title>Failed to Server Render (SSR)</title></head><body><h1>Failed to Server Render (SSR)</h1><h2>Error message:</h2><p>${e.message}</p><h2>File:</h2><p>${e.filename}:${e.line}:${e.column}</p><h2>Stack:</h2><pre><code>${e.stack}</code></pre></body>`

          res.send(minimalHTML).status(500)
        }
      }

      htmlActivity.end()

      return null
    })

}
