  function tickInterval () {
    totalBytes += bytes
    totalCompletedRequests += counter
    samples += 1
    requests.recordValue(counter)
    throughput.recordValue(bytes)
    counter = 0
    bytes = 0

    if (stop) {
      if (stopTimer) clearTimeout(stopTimer)
      tracker.emit('tick', { counter, bytes })
      second.clear()
      interval.clear()
      clients.forEach((client) => client.destroy())
      const result = {
        latencies: encodeHist(latencies),
        requests: encodeHist(requests),
        throughput: encodeHist(throughput),
        totalCompletedRequests,
        totalRequests,
        totalBytes,
        samples,
        errors,
        timeouts,
        mismatches,
        non2xx: statusCodes[0] + statusCodes[2] + statusCodes[3] + statusCodes[4],
        statusCodeStats,
        resets,
        duration: Math.round((Date.now() - startTime) / 10) / 100,
        start: new Date(startTime),
        finish: new Date()
      }

      statusCodes.forEach((code, index) => { result[(index + 1) + 'xx'] = code })

      const resultObj = isMainThread && !opts.skipAggregateResult ? aggregateResult(result, opts, histograms) : result

      if (opts.forever) {
        // we don't call callback when in forever mode, so this is the
        // only place we could notify user when each round finishes
        tracker.emit('done', resultObj)
      } else {
        latencies.destroy()
        requests.destroy()
        throughput.destroy()
        cb(null, resultObj)
      }

      const restartFn = () => {
        stop = false
        stopTimer = setTimeout(() => {
          stop = true
        }, opts.duration * 1000)
        errors = 0
        timeouts = 0
        mismatches = 0
        totalBytes = 0
        totalRequests = 0
        totalCompletedRequests = 0
        resets = 0
        statusCodes.fill(0)
        requests.reset()
        latencies.reset()
        throughput.reset()
        startTime = Date.now()

        // reinitialise clients
        if (opts.overallRate && (opts.overallRate < opts.connections)) opts.connections = opts.overallRate
        clients = []
        initialiseClients(clients)

        interval.reschedule(1000)
        tracker.emit('start')
      }

      // the restart function
      setImmediate(() => {
        if (opts.forever && restart && isMainThread) restartFn()
      })
    }
  }
