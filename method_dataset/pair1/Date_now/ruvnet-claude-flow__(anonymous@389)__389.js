    const interval = setInterval(() => {
      const controlled = this.controlledQueries.get(queryId);
      if (!controlled) {
        this.stopMonitoring(queryId);
        return;
      }

      const update: QueryStatusUpdate = {
        queryId,
        status: controlled.status,
        timestamp: Date.now(),
        metadata: {
          isPaused: controlled.isPaused,
          duration: Date.now() - controlled.startTime
        }
      };

      this.emit('query:status', update);

    }, this.options.monitoringInterval);
