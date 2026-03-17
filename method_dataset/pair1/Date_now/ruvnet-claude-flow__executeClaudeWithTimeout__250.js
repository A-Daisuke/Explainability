function __method_wrapper__() {
  private async executeClaudeWithTimeout(
    sessionId: string,
    task: TaskDefinition,
    agent: AgentState,
    context: ExecutionContext,
    options: ClaudeExecutionOptions,
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const timeout = options.timeout || this.config.timeoutMs;

    // Build Claude command
    const command = this.buildClaudeCommand(task, agent, options);

    // Create execution environment
    const env = {
      ...process.env,
      ...context.environment,
      CLAUDE_TASK_ID: task.id.id,
      CLAUDE_AGENT_ID: agent.id.id,
      CLAUDE_SESSION_ID: sessionId,
      CLAUDE_WORKING_DIR: context.workingDirectory,
    };

    this.logger.debug('Executing Claude command', {
      sessionId,
      command: command.command,
      args: command.args,
      workingDir: context.workingDirectory,
    });

    return new Promise((resolve, reject) => {
      let outputBuffer = '';
      let errorBuffer = '';
      let isTimeout = false;
      let process: ChildProcess | null = null;

      // Setup timeout
      const timeoutHandle = setTimeout(() => {
        isTimeout = true;
        if (process) {
          this.logger.warn('Claude execution timeout, killing process', {
            sessionId,
            pid: process.pid,
            timeout,
          });

          // Graceful shutdown first
          process.kill('SIGTERM');

          // Force kill after grace period
          setTimeout(() => {
            if (process && !process.killed) {
              process.kill('SIGKILL');
            }
          }, this.config.killTimeout);
        }
      }, timeout);

      try {
        // Spawn Claude process
        process = spawn(command.command, command.args, {
          cwd: context.workingDirectory,
          env,
          stdio: ['pipe', 'pipe', 'pipe'],
          detached: options.detached || false,
        });

        if (!process.pid) {
          clearTimeout(timeoutHandle);
          reject(new Error('Failed to spawn Claude process'));
          return;
        }

        this.logger.info('Claude process started', {
          sessionId,
          pid: process.pid,
          command: command.command,
        });

        // Handle process output
        if (process.stdout) {
          process.stdout.on('data', (data: Buffer) => {
            const chunk = data.toString();
            outputBuffer += chunk;

            if (this.config.streamOutput) {
              this.emit('output', {
                sessionId,
                type: 'stdout',
                data: chunk,
              });
            }
          });
        }

        if (process.stderr) {
          process.stderr.on('data', (data: Buffer) => {
            const chunk = data.toString();
            errorBuffer += chunk;

            if (this.config.streamOutput) {
              this.emit('output', {
                sessionId,
                type: 'stderr',
                data: chunk,
              });
            }
          });
        }

        // Handle process completion
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

        // Handle process errors
        process.on('error', (error: Error) => {
          clearTimeout(timeoutHandle);
          this.logger.error('Claude process error', {
            sessionId,
            error: error instanceof Error ? error.message : String(error),
          });
          reject(error);
        });

        // Send input if provided
        if (command.input && process.stdin) {
          process.stdin.write(command.input);
          process.stdin.end();
        }

        // If detached, unreference to allow parent to exit
        if (options.detached) {
          process.unref();
        }
      } catch (error) {
        clearTimeout(timeoutHandle);
        reject(error);
      }
    });
  }

}
