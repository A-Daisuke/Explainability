async function executeRuvSwarmCommand(
  command: string,
  args: string[] = [],
  context?: RuvSwarmToolContext,
  logger?: ILogger,
): Promise<RuvSwarmResponse> {
  try {
    const workDir = context?.workingDirectory || process.cwd();
    const fullCommand = `npx ruv-swarm ${command} ${args.join(' ')}`;

    logger?.debug('Executing ruv-swarm command', { command: fullCommand, workDir });

    const result = await execAsync(fullCommand, { cwd: workDir });

    // Parse JSON response if possible
    let data;
    try {
      data = JSON.parse(result.stdout);
    } catch {
      data = { output: result.stdout, stderr: result.stderr };
    }

    logger?.debug('ruv-swarm command completed', { command, success: true });

    return {
      success: true,
      data,
      metadata: {
        timestamp: Date.now(),
        swarmId: context?.swarmId,
        sessionId: context?.sessionId,
      },
    };
  } catch (error) {
    logger?.error('ruv-swarm command failed', {
      command,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      metadata: {
        timestamp: Date.now(),
        swarmId: context?.swarmId,
        sessionId: context?.sessionId,
      },
    };
  }
}
