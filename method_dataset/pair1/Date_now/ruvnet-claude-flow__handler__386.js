function __method_wrapper__() {
  handler: async (
    payload: WorkflowHookPayload,
    context: AgenticHookContext
  ): Promise<HookHandlerResult> => {
    const { workflowId, error, state } = payload;
    
    if (!error) {
      return { continue: true };
    }
    
    const sideEffects: SideEffect[] = [];
    
    // Analyze error pattern
    const errorPattern = await analyzeErrorPattern(
      workflowId,
      error,
      state,
      context
    );
    
    // Store error for learning
    sideEffects.push({
      type: 'memory',
      action: 'store',
      data: {
        key: `error:${workflowId}:${Date.now()}`,
        value: {
          error: {
            message: error.message,
            stack: error.stack,
            type: error.name,
          },
          pattern: errorPattern,
          state: summarizeState(state),
          timestamp: Date.now(),
        },
        ttl: 604800, // 7 days
      },
    });
    
    // Check for recovery strategies
    const recovery = await findRecoveryStrategy(
      workflowId,
      error,
      errorPattern,
      context
    );
    
    if (recovery) {
      sideEffects.push({
        type: 'log',
        action: 'write',
        data: {
          level: 'info',
          message: 'Recovery strategy found',
          data: recovery,
        },
      });
      
      // Apply recovery
      const recoveredState = applyRecoveryStrategy(state, recovery);
      
      return {
        continue: true,
        modified: true,
        payload: {
          ...payload,
          state: recoveredState,
          error: undefined, // Clear error after recovery
        },
        sideEffects,
      };
    }
    
    // Learn from failure
    const failureLearning: Learning = {
      type: 'failure',
      context: `Error in workflow ${workflowId}: ${error.message}`,
      value: {
        errorType: error.name,
        state: summarizeState(state),
        pattern: errorPattern,
      },
      applicability: errorPattern.confidence,
    };
    
    sideEffects.push({
      type: 'memory',
      action: 'store',
      data: {
        key: `learning:failure:${workflowId}:${Date.now()}`,
        value: failureLearning,
        ttl: 0, // Permanent
      },
    });
    
    return {
      continue: true,
      sideEffects,
    };
  },

}
