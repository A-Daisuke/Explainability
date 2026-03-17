  async function finishLastOperation(): Promise<void> {
    const queryStartTime = Date.now()
    let lastWarningTime = queryStartTime
    const baseWarningInterval = 60 * 1000
    let warningInterval = baseWarningInterval
    let warningCount = 0

    let { currentBulkOperation } = await currentOperation()
    if (currentBulkOperation && currentBulkOperation.id) {
      if (!finishedStatuses.includes(currentBulkOperation.status)) {
        const timer = gatsbyApi.reporter.activityTimer(
          `Waiting for operation ${currentBulkOperation.id} : ${currentBulkOperation.status}`
        )
        timer.start()

        while (!finishedStatuses.includes(currentBulkOperation.status)) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          currentBulkOperation = (await currentOperation()).currentBulkOperation

          // add warning for CI environments
          if (
            process.env.CI &&
            Date.now() > lastWarningTime + warningInterval
          ) {
            lastWarningTime = Date.now()
            const runtime = Math.floor(
              (lastWarningTime - queryStartTime) / 1000
            )
            gatsbyApi.reporter.warn(
              `Operation ${currentBulkOperation.id} is still running after ${runtime} seconds with status "${currentBulkOperation.status}"`
            )

            // handle next interval, slowly increase time so we don't flood every minute
            warningCount += 1
            warningInterval =
              warningCount <= 5
                ? baseWarningInterval
                : baseWarningInterval * 2 * (warningCount - 5)
          }

          timer.setStatus(
            `Polling operation ${currentBulkOperation.id} : ${currentBulkOperation.status}`
          )
        }

        timer.end()
      }
    }
  }
