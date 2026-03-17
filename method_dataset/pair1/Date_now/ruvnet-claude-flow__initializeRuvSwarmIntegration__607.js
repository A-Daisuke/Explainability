export async function initializeRuvSwarmIntegration(
  workingDirectory: string,
  logger?: ILogger,
): Promise<RuvSwarmResponse> {
  const context: RuvSwarmToolContext = {
    workingDirectory,
    sessionId: `claude-flow-${Date.now()}`,
  };

  logger?.info('Initializing ruv-swarm integration', { workingDirectory });

  // Check if ruv-swarm is available
  const available = await isRuvSwarmAvailable(logger);
  if (!available) {
    return {
      success: false,
      error: 'ruv-swarm is not available. Please install it with: npm install -g ruv-swarm',
    };
  }

  // Get capabilities
  const capabilities = await getRuvSwarmCapabilities(logger);

  logger?.info('ruv-swarm integration initialized', { capabilities });

  return {
    success: true,
    data: {
      available: true,
      capabilities,
      integration: 'claude-code-flow',
      sessionId: context.sessionId,
    },
    metadata: {
      timestamp: Date.now(),
      sessionId: context.sessionId,
    },
  };
}
