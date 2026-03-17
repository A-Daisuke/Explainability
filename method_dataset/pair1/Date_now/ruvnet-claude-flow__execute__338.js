function __method_wrapper__() {
  swarmCommand.execute = async function(objective, options) {
    // Create checkpoint before swarm execution
    const checkpoint = await createGitCheckpoint();
    
    // Wrap the original execution with verification
    const context = {
      requiresCleanState: !options.allowDirty,
      dependencies: options.dependencies || [],
      language: options.language || 'javascript',
      hasTests: options.runTests !== false,
      requiresCoverage: options.coverage === true,
      gitCheckpoint: checkpoint
    };

    // Execute with verification
    return await middleware.executeWithVerification(
      () => originalExecute.call(this, objective, options),
      `swarm-${Date.now()}`,
      'swarm',
      context
    );
  };

}
