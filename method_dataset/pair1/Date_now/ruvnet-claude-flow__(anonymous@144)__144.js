    const result = await this.executionQueue.add(async () => {
      try {
        // Execute with connection pool
        const executionResult = await this.connectionPool.execute(async (api) => {
          const response = await api.complete({
            messages: this.buildMessages(task),
            model: task.metadata?.model || 'claude-3-5-sonnet-20241022',
            max_tokens: task.constraints.maxTokens || 4096,
            temperature: task.metadata?.temperature || 0.7,
          });

          return {
            success: true,
            output: response.content[0]?.text || '',
            usage: {
              inputTokens: response.usage?.input_tokens || 0,
              outputTokens: response.usage?.output_tokens || 0,
            },
          };
        });

        // Save result to file asynchronously
        if (this.config.fileOperations?.outputDir) {
          const outputPath = `${this.config.fileOperations.outputDir}/${task.id}.json`;
          await this.fileManager.writeJSON(outputPath, {
            taskId: task.id,
            agentId: agentId.id,
            result: executionResult,
            timestamp: new Date(),
          });
        }

        // Create task result
        const taskResult: TaskResult = {
          taskId: task.id,
          agentId: agentId.id,
          success: executionResult.success,
          output: executionResult.output,
          error: undefined,
          executionTime: Date.now() - startTime,
          tokensUsed: executionResult.usage,
          timestamp: new Date(),
        };

        // Cache result if enabled
        if (this.config.caching?.enabled && executionResult.success) {
          this.resultCache.set(taskKey, taskResult);
        }

        // Update metrics
        this.metrics.totalExecuted++;
        this.metrics.totalSucceeded++;
        this.metrics.totalExecutionTime += taskResult.executionTime;

        // Record in history
        this.executionHistory.push({
          taskId: task.id,
          duration: taskResult.executionTime,
          status: 'success',
          timestamp: new Date(),
        });

        // Check if slow task
        if (
          this.config.monitoring?.slowTaskThreshold &&
          taskResult.executionTime > this.config.monitoring.slowTaskThreshold
        ) {
          this.logger.warn('Slow task detected', {
            taskId: task.id,
            duration: taskResult.executionTime,
            threshold: this.config.monitoring.slowTaskThreshold,
          });
        }

        this.emit('task:completed', taskResult);
        return taskResult;
      } catch (error) {
        this.metrics.totalExecuted++;
        this.metrics.totalFailed++;

        const errorResult: TaskResult = {
          taskId: task.id,
          agentId: agentId.id,
          success: false,
          output: '',
          error: {
            type: error instanceof Error ? error.constructor.name : 'UnknownError',
            message: error instanceof Error ? error.message : 'Unknown error',
            code: (error as any).code,
            stack: error instanceof Error ? error.stack : undefined,
            context: { taskId: task.id, agentId: agentId.id },
            recoverable: this.isRecoverableError(error),
            retryable: this.isRetryableError(error),
          },
          executionTime: Date.now() - startTime,
          timestamp: new Date(),
        };

        // Record in history
        this.executionHistory.push({
          taskId: task.id,
          duration: errorResult.executionTime,
          status: 'failed',
          timestamp: new Date(),
        });

        this.emit('task:failed', errorResult);
        throw error;
      } finally {
        this.activeExecutions.delete(task.id);
      }
    });
