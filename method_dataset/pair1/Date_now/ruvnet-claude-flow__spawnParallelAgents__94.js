function __method_wrapper__() {
  async spawnParallelAgents(
    agentConfigs: ParallelAgentConfig[],
    options: SessionForkOptions = {}
  ): Promise<ParallelExecutionResult> {
    const startTime = Date.now();
    const executionId = generateId('parallel-exec');

    this.logger.info('Starting parallel agent spawning', {
      executionId,
      agentCount: agentConfigs.length,
      forkingEnabled: true
    });

    // Sort by priority
    const sortedConfigs = this.sortByPriority(agentConfigs);

    // Limit parallel execution
    const maxParallel = options.maxParallelAgents || 10;
    const batches = this.createBatches(sortedConfigs, maxParallel);

    const agentResults = new Map();
    const failedAgents: string[] = [];
    const successfulAgents: string[] = [];

    // Execute in batches to avoid overwhelming the system
    for (const batch of batches) {
      const batchPromises = batch.map(config =>
        this.spawnSingleAgent(config, options, executionId)
      );

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        const config = batch[index];

        if (result.status === 'fulfilled') {
          agentResults.set(config.agentId, result.value);
          successfulAgents.push(config.agentId);
        } else {
          failedAgents.push(config.agentId);
          agentResults.set(config.agentId, {
            agentId: config.agentId,
            output: '',
            messages: [],
            duration: Date.now() - startTime,
            status: 'failed',
            error: result.reason
          });
        }
      });
    }

    const totalDuration = Date.now() - startTime;

    // Calculate performance metrics
    this.updateMetrics(agentConfigs.length, totalDuration);

    const result: ParallelExecutionResult = {
      success: failedAgents.length === 0,
      agentResults,
      totalDuration,
      failedAgents,
      successfulAgents
    };

    this.logger.info('Parallel agent spawning completed', {
      executionId,
      totalAgents: agentConfigs.length,
      successful: successfulAgents.length,
      failed: failedAgents.length,
      duration: totalDuration,
      performanceGain: this.executionMetrics.performanceGain
    });

    this.emit('parallel:complete', result);

    return result;
  }

}
