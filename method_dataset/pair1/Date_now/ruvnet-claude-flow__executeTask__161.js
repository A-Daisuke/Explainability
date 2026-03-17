function __method_wrapper__() {
  async executeTask(
    task: TaskDefinition,
    agent: AgentState,
    options: {
      timeout?: number;
      retryAttempts?: number;
      priority?: number;
    } = {},
  ): Promise<TaskExecutionResult> {
    const startTime = Date.now();
    let retryCount = 0;
    const maxRetries = options.retryAttempts ?? this.config.retryAttempts;
    const timeout = options.timeout ?? this.config.defaultTimeout;

    this.logger.info('Starting task execution', {
      taskId: task.id.id,
      agentId: agent.id.id,
      type: task.type,
      timeout,
      maxRetries,
    });

    // Check if we have capacity
    if (this.runningTasks.size >= this.config.maxConcurrentTasks) {
      this.queuedTasks.push(task);
      this.logger.info('Task queued due to capacity limits', {
        taskId: task.id.id,
        queueSize: this.queuedTasks.length,
      });

      // Wait for capacity
      await this.waitForCapacity();
    }

    while (retryCount <= maxRetries) {
      try {
        const result = await this.executeSingleAttempt(task, agent, timeout, retryCount);

        this.logger.info('Task completed successfully', {
          taskId: task.id.id,
          executionTime: Date.now() - startTime,
          retryCount,
        });

        return {
          success: true,
          result: result.result,
          executionTime: Date.now() - startTime,
          resourcesUsed: result.resourcesUsed,
          retryCount,
        };
      } catch (error) {
        retryCount++;

        this.logger.warn('Task attempt failed', {
          taskId: task.id.id,
          attempt: retryCount,
          maxRetries,
          error: getErrorMessage(error),
        });

        // Check if we should retry
        if (retryCount > maxRetries) {
          const taskError: TaskError = {
            type: 'execution_failed',
            message: getErrorMessage(error),
            stack: getErrorStack(error),
            context: {
              retryCount,
              maxRetries,
              taskType: task.type,
            },
            recoverable: false,
            retryable: false,
          };

          return {
            success: false,
            error: taskError,
            executionTime: Date.now() - startTime,
            resourcesUsed: this.getDefaultResourceUsage(),
            retryCount,
          };
        }

        // Calculate backoff delay
        const backoffDelay = Math.min(
          this.config.retryBackoffBase * Math.pow(2, retryCount - 1),
          this.config.retryBackoffMax,
        );

        this.logger.info('Retrying task after backoff', {
          taskId: task.id.id,
          backoffDelay,
          attempt: retryCount + 1,
        });

        await this.delay(backoffDelay);
      }
    }

    // This should never be reached, but TypeScript requires it
    throw new Error('Unexpected end of retry loop');
  }

}
