function __method_wrapper__() {
  async rollbackToCheckpoint(
    checkpointId: string,
    options: Partial<RollbackOptions> = {}
  ): Promise<RollbackResult> {
    const rollbackStart = Date.now();
    const defaultOptions: RollbackOptions = {
      mode: 'strict',
      verify_before_rollback: true,
      verify_after_rollback: true,
      create_backup_before: true,
      components_to_rollback: ['agents', 'tasks', 'memory', 'filesystem', 'database'],
      exclude_components: []
    };

    const rollbackOptions = { ...defaultOptions, ...options };
    
    console.log(`🔄 Starting rollback to checkpoint ${checkpointId} with mode: ${rollbackOptions.mode}`);

    try {
      // 1. Get the target checkpoint
      const checkpoint = await this.checkpointManager.getCheckpoint(checkpointId);
      if (!checkpoint) {
        throw new Error(`Checkpoint ${checkpointId} not found`);
      }

      // 2. Create backup if requested
      let backupCheckpointId: string | undefined;
      if (rollbackOptions.create_backup_before) {
        backupCheckpointId = await this.checkpointManager.createCheckpoint(
          `Backup before rollback to ${checkpointId}`,
          'global'
        );
        console.log(`💾 Created backup checkpoint: ${backupCheckpointId}`);
      }

      // 3. Verify rollback is safe (if requested)
      if (rollbackOptions.verify_before_rollback) {
        const safetyCheck = await this.verifyRollbackSafety(checkpoint.state_snapshot, rollbackOptions);
        if (!safetyCheck.safe && rollbackOptions.mode === 'strict') {
          throw new Error(`Unsafe rollback detected: ${safetyCheck.reasons.join(', ')}`);
        } else if (!safetyCheck.safe && rollbackOptions.mode === 'partial') {
          console.warn(`⚠️ Safety concerns detected but proceeding in partial mode: ${safetyCheck.reasons.join(', ')}`);
        }
      }

      // 4. Execute rollback
      const affectedComponents = await this.executeRollback(
        checkpoint.state_snapshot, 
        rollbackOptions
      );

      // 5. Verify rollback success (if requested)
      let verificationDetails: VerificationDetails = {
        verified: true,
        checks_performed: [],
        failed_checks: [],
        verification_time_ms: 0
      };

      if (rollbackOptions.verify_after_rollback) {
        verificationDetails = await this.verifyRollbackSuccess(
          checkpoint.state_snapshot,
          rollbackOptions
        );
      }

      // 6. Create rollback result
      const rollbackResult: RollbackResult = {
        success: verificationDetails.verified,
        checkpoint_id: checkpointId,
        rollback_time_ms: Date.now() - rollbackStart,
        verification_details: verificationDetails,
        affected_components: affectedComponents,
        error_message: verificationDetails.verified ? undefined : 'Rollback verification failed'
      };

      // 7. Store rollback history
      this.addToRollbackHistory(rollbackResult);

      if (rollbackResult.success) {
        console.log(`✅ Rollback completed successfully in ${rollbackResult.rollback_time_ms}ms`);
      } else {
        console.error(`❌ Rollback failed: ${rollbackResult.error_message}`);
      }

      return rollbackResult;

    } catch (error: any) {
      const rollbackResult: RollbackResult = {
        success: false,
        checkpoint_id: checkpointId,
        rollback_time_ms: Date.now() - rollbackStart,
        verification_details: {
          verified: false,
          checks_performed: [],
          failed_checks: ['rollback_execution'],
          verification_time_ms: 0
        },
        affected_components: [],
        error_message: error.message
      };

      this.addToRollbackHistory(rollbackResult);
      
      // Attempt emergency recovery if in strict mode
      if (rollbackOptions.mode === 'strict') {
        await this.attemptEmergencyRecovery(error);
      }

      throw error;
    }
  }

}
