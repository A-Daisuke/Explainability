async function executeFunction(
  req: IGatsbyInternalRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.context) {
    reporter.verbose(`Running ${req.context.functionObj.functionRoute}`)
    req.params = req.context.params
    const start = Date.now()
    const context = req.context
    // we don't want to leak internal context to actual request handler
    delete req.context
    try {
      await Promise.resolve(context.fnToExecute(req, res))
    } catch (e) {
      if (e?.message?.includes(`fnToExecute is not a function`)) {
        e.message = `${context.functionObj.originalAbsoluteFilePath} does not export a function.`
      }

      reporter.error(e)
      // Don't send the error if that would cause another error.
      if (!res.headersSent) {
        if (context.showDebugMessageInResponse) {
          res
            .status(500)
            .send(
              `Error when executing function "${context.functionObj.originalAbsoluteFilePath}":<br /><br />${e.message}`
            )
        } else {
          res.sendStatus(500)
        }
      }
    }

    const end = Date.now()
    reporter.log(
      `Executed function "/api/${context.functionObj.functionRoute}" in ${
        end - start
      }ms`
    )
  } else {
    next()
  }
}
