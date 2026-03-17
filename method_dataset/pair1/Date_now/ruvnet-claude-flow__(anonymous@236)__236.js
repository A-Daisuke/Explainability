function __method_wrapper__() {
        process.on('close', async (code: number | null, signal: string | null) => {
          clearTimeout(timeoutHandle);

          const duration = Date.now() - startTime;
          const exitCode = code || 0;

          this.logger.info('Claude process completed (v2)', {
            sessionId,
            exitCode,
            signal,
            duration,
            isTimeout,
            hasErrors: errorBuffer.length > 0,
          });

          try {
            // Collect resource usage
            const resourceUsage = await this.collectResourceUsage(sessionId);

            // Collect artifacts
            const artifacts = await this.collectArtifacts(context);

            const result: ExecutionResult = {
              success: !isTimeout && exitCode === 0,
              output: outputBuffer,
              error: errorBuffer,
              exitCode,
              duration,
              resourcesUsed: resourceUsage,
              artifacts,
              metadata: {
                environment: this.environment.terminalType,
                nonInteractive: options.nonInteractive || false,
                appliedDefaults: (options as any).appliedDefaults || [],
              },
            };

            if (isTimeout) {
              reject(new Error(`Execution timed out after ${timeout}ms`));
            } else if (exitCode !== 0 && this.isInteractiveErrorMessage(errorBuffer)) {
              reject(new Error(`Interactive mode error: ${errorBuffer.trim()}`));
            } else {
              resolve(result);
            }
          } catch (collectionError) {
            this.logger.error('Error collecting execution results', {
              sessionId,
              error: collectionError.message,
            });

            // Still resolve with basic result
            resolve({
              success: !isTimeout && exitCode === 0,
              output: outputBuffer,
              error: errorBuffer,
              exitCode,
              duration,
              resourcesUsed: this.getDefaultResourceUsage(),
              artifacts: {},
              metadata: {},
            });
          }
        });

}
