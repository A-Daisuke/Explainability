function __method_wrapper__() {
  private async executeClaudeWithTimeoutV2(
    sessionId: string,
    task: TaskDefinition,
    agent: AgentState,
    context: ExecutionContext,
    options: ClaudeExecutionOptionsV2,
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const timeout = options.timeout || this.config.timeoutMs;

    // Build Claude command with v2 enhancements
    const command = this.buildClaudeCommandV2(task, agent, options);

    // Create execution environment with enhancements
    const env = {
      ...process.env,
      ...context.environment,
      ...options.environmentOverride,
      CLAUDE_TASK_ID: task.id.id,
      CLAUDE_AGENT_ID: agent.id.id,
      CLAUDE_SESSION_ID: sessionId,
      CLAUDE_WORKING_DIR: context.workingDirectory,
      CLAUDE_NON_INTERACTIVE: options.nonInteractive ? '1' : '0',
      CLAUDE_AUTO_APPROVE: options.autoApprove ? '1' : '0',
    };

    // Add prompt defaults if provided
    if (options.promptDefaults) {
      env.CLAUDE_PROMPT_DEFAULTS = JSON.stringify(options.promptDefaults);
    }

    this.logger.debug('Executing Claude command v2', {
      sessionId,
      command: command.command,
      args: command.args,
      workingDir: context.workingDirectory,
      nonInteractive: options.nonInteractive,
      environment: this.environment.terminalType,
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

          process.kill('SIGTERM');
          setTimeout(() => {
            if (process && !process.killed) {
              process.kill('SIGKILL');
            }
          }, this.config.killTimeout);
        }
      }, timeout);

      try {
        // Spawn Claude process with enhanced options
        process = spawn(command.command, command.args, {
          cwd: context.workingDirectory,
          env,
          stdio: options.nonInteractive ? ['ignore', 'pipe', 'pipe'] : ['pipe', 'pipe', 'pipe'],
          detached: options.detached || false,
          // Disable shell to avoid shell-specific issues
          shell: false,
        });

        if (!process.pid) {
          clearTimeout(timeoutHandle);
          reject(new Error('Failed to spawn Claude process'));
          return;
        }

        this.logger.info('Claude process started (v2)', {
          sessionId,
          pid: process.pid,
          command: command.command,
          mode: options.nonInteractive ? 'non-interactive' : 'interactive',
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

            // Check for interactive mode errors
            if (this.isInteractiveErrorMessage(chunk)) {
              this.logger.warn('Interactive mode error detected in stderr', {
                sessionId,
                error: chunk.trim(),
              });
            }

            if (this.config.streamOutput) {
              this.emit('output', {
                sessionId,
                type: 'stderr',
                data: chunk,
              });
            }
          });
        }

        // Handle process errors
        process.on('error', (error: Error) => {
          clearTimeout(timeoutHandle);
          this.logger.error('Process error', {
            sessionId,
            error: error.message,
            code: (error as any).code,
          });
          reject(error);
        });

        // Handle process completion
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
      } catch (spawnError) {
        clearTimeout(timeoutHandle);
        this.logger.error('Failed to spawn process', {
          sessionId,
          error: spawnError.message,
        });
        reject(spawnError);
      }
    });
  }

}
