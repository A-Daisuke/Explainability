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
