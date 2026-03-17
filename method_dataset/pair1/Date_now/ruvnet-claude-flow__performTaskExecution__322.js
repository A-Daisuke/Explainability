function __method_wrapper__() {
  private async performTaskExecution(
    task: TaskDefinition,
    agent: AgentState,
    context: ExecutionContext,
  ): Promise<{ result: TaskResult; resourcesUsed: ResourceUsage }> {
    const startTime = Date.now();

    // Create task execution command
    const command = this.buildExecutionCommand(task, agent);

    this.logger.debug('Executing task command', {
      taskId: task.id.id,
      command: command.cmd,
      args: command.args,
    });

    // Spawn process
    const childProcess = spawn(command.cmd, command.args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        ...command.env,
        TASK_ID: task.id.id,
        AGENT_ID: agent.id.id,
        TASK_TYPE: task.type,
      },
    });

    context.process = childProcess;

    // Collect output
    let stdout = '';
    let stderr = '';

    childProcess.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    childProcess.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    // Send input if provided
    if (task.input && childProcess.stdin) {
      childProcess.stdin.write(
        JSON.stringify({
          task: task,
          agent: agent,
          input: task.input,
        }),
      );
      childProcess.stdin.end();
    }

    // Wait for process completion
    const exitCode = await new Promise<number>((resolve, reject) => {
      childProcess.on('exit', (code) => {
        resolve(code ?? 0);
      });

      childProcess.on('error', (error) => {
        reject(new Error(`Process error: ${getErrorMessage(error)}`));
      });
    });

    const executionTime = Date.now() - startTime;

    // Parse result
    let taskResult: TaskResult;

    if (exitCode === 0) {
      try {
        const output = JSON.parse(stdout);
        taskResult = {
          output: output.result || output,
          artifacts: output.artifacts || {},
          metadata: output.metadata || {},
          quality: output.quality || 0.8,
          completeness: output.completeness || 1.0,
          accuracy: output.accuracy || 0.9,
          executionTime,
          resourcesUsed: context.resources,
          validated: false,
        };
      } catch (error) {
        taskResult = {
          output: stdout,
          artifacts: {},
          metadata: { stderr },
          quality: 0.5,
          completeness: 1.0,
          accuracy: 0.7,
          executionTime,
          resourcesUsed: context.resources,
          validated: false,
        };
      }
    } else {
      throw new Error(`Task execution failed with exit code ${exitCode}: ${stderr}`);
    }

    return {
      result: taskResult,
      resourcesUsed: context.resources,
    };
  }

}
