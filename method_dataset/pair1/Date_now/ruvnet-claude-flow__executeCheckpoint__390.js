function __method_wrapper__() {
  private async executeCheckpoint(
    checkpoint: VerificationCheckpoint,
    context: VerificationContext,
    callbacks?: PipelineCallbacks
  ): Promise<CheckpointResult> {
    const startTime = Date.now();
    
    this.logger.info('Executing checkpoint', {
      checkpointId: checkpoint.id,
      type: checkpoint.type,
      mandatory: checkpoint.mandatory,
      validatorCount: checkpoint.validators.length,
    });

    try {
      // Check if paused
      while (this.currentExecution?.status === 'paused') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Check if cancelled
      if (this.currentExecution?.status === 'cancelled') {
        throw new AppError('Execution cancelled', 'EXECUTION_CANCELLED');
      }

      // Create snapshot if required
      if (checkpoint.createSnapshot && this.config.enableRollback) {
        await this.createSnapshot(checkpoint.id, `Before checkpoint ${checkpoint.name}`);
      }

      // Execute validators
      const validatorResults = await this.executeValidators(checkpoint.validators, context);

      // Evaluate conditions
      const conditionResults = this.evaluateConditions(checkpoint.conditions, context, validatorResults);

      // Calculate checkpoint result
      const passed = validatorResults.every(vr => vr.passed) && conditionResults.every(cr => cr.passed);
      const score = validatorResults.reduce((sum, vr) => sum + vr.score, 0) / validatorResults.length;

      const result: CheckpointResult = {
        checkpointId: checkpoint.id,
        status: passed ? 'passed' : 'failed',
        score,
        passed,
        duration: Date.now() - startTime,
        validatorResults,
        evidence: validatorResults.flatMap(vr => vr.evidence),
        errors: validatorResults.flatMap(vr => vr.errors || []),
        warnings: validatorResults.flatMap(vr => vr.warnings || []),
      };

      // Handle rollback on failure
      if (!passed && checkpoint.rollbackOnFailure && this.config.enableRollback) {
        await this.handleCheckpointRollback(checkpoint);
      }

      // Update execution state
      if (this.currentExecution) {
        this.currentExecution.checkpointResults.push(result);
      }

      // Cache result
      this.checkpointCache.set(checkpoint.id, result);

      // Call checkpoint callback
      if (callbacks?.onCheckpointComplete) {
        await callbacks.onCheckpointComplete(result);
      }

      this.eventEmitter?.emit('checkpoint:completed', result);

      this.logger.info('Checkpoint execution completed', {
        checkpointId: checkpoint.id,
        passed,
        score,
        duration: result.duration,
      });

      return result;
    } catch (error) {
      const errorResult: CheckpointResult = {
        checkpointId: checkpoint.id,
        status: 'error',
        score: 0,
        passed: false,
        duration: Date.now() - startTime,
        validatorResults: [],
        evidence: [],
        errors: [{
          code: 'CHECKPOINT_EXECUTION_ERROR',
          message: `Checkpoint execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'high',
          context: { checkpointId: checkpoint.id },
          recoverable: !checkpoint.mandatory,
          timestamp: new Date(),
        }],
        warnings: [],
      };

      this.logger.error('Checkpoint execution failed', {
        checkpointId: checkpoint.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return errorResult;
    }
  }

}
