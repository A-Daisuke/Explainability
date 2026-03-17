function __method_wrapper__() {
        process.on('close', async (code: number | null, signal: string | null) => {
          clearTimeout(timeoutHandle);

          const duration = Date.now() - startTime;
          const exitCode = code || 0;

          this.logger.info('Claude process completed', {
            sessionId,
            exitCode,
            signal,
            duration,
            isTimeout,
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
                sessionId,
                timeout: isTimeout,
                signal,
                command: command.command,
                args: command.args,
              },
            };

            if (isTimeout) {
              reject(new Error(`Claude execution timed out after ${timeout}ms`));
            } else if (exitCode !== 0) {
              reject(
                new Error(`Claude execution failed with exit code ${exitCode}: ${errorBuffer}`),
              );
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        });

}
