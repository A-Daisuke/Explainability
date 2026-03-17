function __method_wrapper__() {
  async scoreClaim(claim: AgentClaim, context?: ScoringContext): Promise<TruthScore> {
    const startTime = Date.now();
    this.logger.debug('Starting truth score calculation', {
      claimId: claim.id,
      claimType: claim.type,
      agentId: claim.agentId,
    });

    try {
      // Initialize score components
      const components: Partial<TruthScoreComponents> = {};
      const evidence: TruthEvidence[] = [];
      const errors: VerificationError[] = [];

      // Calculate individual components
      if (this.config.checks.historicalValidation) {
        components.agentReliability = await this.calculateAgentReliability(claim, evidence, errors);
      }

      if (this.config.checks.crossAgentValidation && context?.peers) {
        components.crossValidation = await this.calculateCrossValidation(claim, context.peers, evidence, errors);
      }

      if (this.config.checks.externalValidation && context?.externalSources) {
        components.externalVerification = await this.calculateExternalVerification(claim, context.externalSources, evidence, errors);
      }

      if (this.config.checks.logicalValidation) {
        components.logicalCoherence = await this.calculateLogicalCoherence(claim, evidence, errors);
      }

      if (this.config.checks.statisticalValidation) {
        components.factualConsistency = await this.calculateFactualConsistency(claim, evidence, errors);
      }

      // Calculate overall score using weighted average
      const overall = this.calculateWeightedScore(components as TruthScoreComponents);
      const fullComponents: TruthScoreComponents = {
        agentReliability: components.agentReliability || 0,
        crossValidation: components.crossValidation || 0,
        externalVerification: components.externalVerification || 0,
        logicalCoherence: components.logicalCoherence || 0,
        factualConsistency: components.factualConsistency || 0,
        overall,
      };

      // Calculate confidence interval
      const confidence = this.calculateConfidenceInterval(fullComponents, evidence.length);

      const score: TruthScore = {
        score: overall,
        components: fullComponents,
        confidence,
        evidence,
        timestamp: new Date(),
        metadata: {
          claimId: claim.id,
          agentId: claim.agentId,
          calculationTime: Date.now() - startTime,
          evidenceCount: evidence.length,
          errorCount: errors.length,
          config: this.config,
        },
      };

      this.logger.info('Truth score calculated', {
        claimId: claim.id,
        score: overall,
        components: fullComponents,
        confidence: confidence.level,
        duration: Date.now() - startTime,
      });

      return score;
    } catch (error) {
      this.logger.error('Failed to calculate truth score', error);
      throw new AppError(
        `Truth score calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'TRUTH_SCORE_CALCULATION_FAILED',
        500
      );
    }
  }

}
