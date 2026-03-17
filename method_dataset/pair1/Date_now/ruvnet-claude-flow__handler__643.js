function __method_wrapper__() {
      handler: async (payload: PerformanceHookPayload, context: AgenticHookContext): Promise<HookHandlerResult> => {
        if (!this.config.telemetry.enabled) {
          return { continue: true };
        }

        const verificationContext = this.getOrCreateVerificationContext(payload, context);
        
        try {
          await this.executeTruthValidation(verificationContext, payload);
          
          const truthfulness = this.calculateTruthfulness(verificationContext);
          
          return {
            continue: true,
            modified: true,
            payload: {
              ...payload,
              truthResults: verificationContext.state.truthResults,
              truthfulness
            },
            metadata: {
              truthValidationComplete: true,
              truthfulness,
              validatorCount: this.config.telemetry.truthValidators.length
            },
            sideEffects: [
              {
                type: 'metric',
                action: 'update',
                data: {
                  name: 'verification.truthfulness',
                  value: truthfulness
                }
              },
              {
                type: 'memory',
                action: 'store',
                data: {
                  key: `truth_telemetry_${Date.now()}`,
                  value: {
                    timestamp: Date.now(),
                    truthfulness,
                    results: verificationContext.state.truthResults
                  }
                }
              }
            ]
          };
        } catch (error) {
          logger.error('Truth telemetry execution error:', error);
          
          return {
            continue: true,
            metadata: {
              truthTelemetryError: true,
              error: (error as Error).message
            }
          };
        }
      },

}
