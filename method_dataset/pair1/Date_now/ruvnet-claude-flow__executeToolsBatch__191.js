class __C__ {
  async executeToolsBatch(toolExecutions, options = {}) {
    const batchId = `batch_${Date.now()}`;
    const results = [];

    this.ui.addLog('info', `Starting batch execution: ${toolExecutions.length} tools`);

    try {
      if (options.parallel) {
        // Execute in parallel
        const promises = toolExecutions.map(({ toolName, parameters, toolOptions }) =>
          this.executeTool(toolName, parameters, toolOptions),
        );

        const settled = await Promise.allSettled(promises);

        settled.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push({ success: true, execution: result.value });
          } else {
            results.push({
              success: false,
              error: result.reason.message,
              toolName: toolExecutions[index].toolName,
            });
          }
        });
      } else {
        // Execute sequentially
        for (let i = 0; i < toolExecutions.length; i++) {
          const { toolName, parameters, toolOptions } = toolExecutions[i];

          try {
            const execution = await this.executeTool(toolName, parameters, toolOptions);
            results.push({ success: true, execution });

            // Report progress
            if (options.progressCallback) {
              options.progressCallback({
                completed: i + 1,
                total: toolExecutions.length,
                progress: ((i + 1) / toolExecutions.length) * 100,
                currentTool: toolName,
              });
            }
          } catch (error) {
            results.push({
              success: false,
              error: error.message,
              toolName,
            });

            // Stop on first error if configured
            if (options.stopOnError) {
              break;
            }
          }
        }
      }

      const successful = results.filter((r) => r.success).length;
      this.ui.addLog(
        'success',
        `Batch ${batchId} completed: ${successful}/${results.length} successful`,
      );

      return {
        batchId,
        results,
        summary: {
          total: results.length,
          successful,
          failed: results.length - successful,
        },
      };
    } catch (error) {
      this.ui.addLog('error', `Batch ${batchId} failed: ${error.message}`);
      throw error;
    }
  }

}
