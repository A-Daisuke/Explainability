function __method_wrapper__() {
    return async () => {
      try {
        const data = await dataLoader();

        if (!Array.isArray(data)) {
          // Non-array data, load immediately
          this.broadcastUpdate(viewName, {
            type: 'data_loaded',
            data,
            timestamp: Date.now(),
          });

          if (onComplete) onComplete(data);
          return;
        }

        // Progressive loading for arrays
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);

          this.broadcastUpdate(viewName, {
            type: 'data_chunk',
            chunk,
            progress: {
              loaded: Math.min(i + chunkSize, data.length),
              total: data.length,
              percentage: Math.min(((i + chunkSize) / data.length) * 100, 100),
            },
            timestamp: Date.now(),
          });

          if (onProgress) {
            onProgress({
              loaded: Math.min(i + chunkSize, data.length),
              total: data.length,
              percentage: Math.min(((i + chunkSize) / data.length) * 100, 100),
            });
          }

          // Small delay between chunks to prevent blocking
          if (i + chunkSize < data.length) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        if (onComplete) onComplete(data);
      } catch (error) {
        this.broadcastUpdate(viewName, {
          type: 'data_error',
          error: error.message,
          timestamp: Date.now(),
        });
      }
    };

}
