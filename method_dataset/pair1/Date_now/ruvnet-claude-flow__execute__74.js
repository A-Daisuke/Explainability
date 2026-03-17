function __method_wrapper__() {
  async execute(
    context: VerificationContext,
    callbacks?: PipelineCallbacks
  ): Promise<VerificationResult> {
    const startTime = Date.now();
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.logger.info('Starting verification pipeline execution', {
      executionId,
      pipelineId: this.config.id,
      context: {
        targetType: context.target?.type,
        targetId: context.target?.id,
        parametersCount: Object.keys(context.parameters || {}).length,
      },
    });

    try {
      // Initialize execution state
      this.currentExecution = {
        id: executionId,
        pipelineId: this.config.id,
        status: 'running',
        startTime: new Date(),
        context,
        checkpointResults: [],
        snapshots: [],
        resourceUsage: this.initializeResourceUsage(),
        callbacks,
      };

      // Create initial snapshot if enabled
      if (this.config.enableRollback) {
        await this.createSnapshot('initial', 'Pipeline execution start');
      }

      // Validate pipeline configuration
      await this.validatePipelineConfig();

      // Sort checkpoints by order
      const sortedCheckpoints = [...this.config.checkpoints].sort((a, b) => a.order - b.order);

      // Execute checkpoints
      const checkpointResults = await this.executeCheckpoints(sortedCheckpoints, context, callbacks);

      // Calculate overall result
      const overallResult = this.calculateOverallResult(checkpointResults);

      // Create final verification result
      const result: VerificationResult = {
        id: executionId,
        pipelineId: this.config.id,
        timestamp: new Date(),
        status: overallResult.status,
        score: overallResult.score,
        passed: overallResult.passed,
        checkpointResults,
        truthScore: overallResult.truthScore,
        duration: Date.now() - startTime,
        resourceUsage: this.currentExecution.resourceUsage,
        evidence: overallResult.evidence,
        artifacts: overallResult.artifacts,
        errors: overallResult.errors,
        warnings: overallResult.warnings,
        recommendations: overallResult.recommendations,
        nextSteps: overallResult.nextSteps,
      };

      // Update execution state
      this.currentExecution.status = result.status;
      this.currentExecution.endTime = new Date();
      this.currentExecution.result = result;

      // Add to history
      this.executionHistory.push(this.currentExecution);
      this.currentExecution = undefined;

      // Emit completion event
      this.eventEmitter?.emit('pipeline:completed', result);

      this.logger.info('Verification pipeline execution completed', {
        executionId,
        status: result.status,
        passed: result.passed,
        score: result.score,
        duration: result.duration,
        checkpointsPassed: checkpointResults.filter(r => r.passed).length,
        checkpointsTotal: checkpointResults.length,
      });

      return result;
    } catch (error) {
      const errorResult = await this.handleExecutionError(error, executionId, startTime);
      
      if (this.currentExecution) {
        this.currentExecution.status = 'error';
        this.currentExecution.endTime = new Date();
        this.currentExecution.result = errorResult;
        this.executionHistory.push(this.currentExecution);
        this.currentExecution = undefined;
      }

      this.eventEmitter?.emit('pipeline:error', errorResult);
      
      return errorResult;
    }
  }

}
