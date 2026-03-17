function __method_wrapper__() {
  async rollbackDeployment(
    deploymentId: string,
    reason: string,
    userId: string = 'system',
  ): Promise<void> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) {
      throw new Error(`Deployment not found: ${deploymentId}`);
    }

    // Find previous successful deployment
    const previousDeployment = await this.getPreviousSuccessfulDeployment(
      deployment.projectId,
      deployment.environmentId,
      deploymentId,
    );

    if (!previousDeployment) {
      throw new Error('No previous successful deployment found for rollback');
    }

    const rollbackStartTime = new Date();

    deployment.rollback = {
      triggered: true,
      reason,
      timestamp: rollbackStartTime,
      previousDeploymentId: previousDeployment.id,
      rollbackDuration: 0,
    };

    deployment.status = 'rolled-back';
    deployment.updatedAt = new Date();

    this.addAuditEntry(deployment, userId, 'rollback_initiated', 'deployment', {
      deploymentId,
      previousDeploymentId: previousDeployment.id,
      reason,
    });

    try {
      // Execute rollback strategy
      await this.executeRollbackStrategy(deployment, previousDeployment);

      deployment.rollback.rollbackDuration = Date.now() - rollbackStartTime.getTime();

      this.addAuditEntry(deployment, userId, 'rollback_completed', 'deployment', {
        deploymentId,
        rollbackDuration: deployment.rollback.rollbackDuration,
      });

      this.emit('deployment:rolled-back', deployment);
      this.logger.info(`Deployment rolled back: ${deploymentId}`);
    } catch (error) {
      this.addAuditEntry(deployment, userId, 'rollback_failed', 'deployment', {
        deploymentId,
        error: error instanceof Error ? error.message : String(error),
      });

      this.logger.error(`Rollback failed for deployment ${deploymentId}`, { error });
      throw error;
    }

    await this.saveDeployment(deployment);
  }

}
