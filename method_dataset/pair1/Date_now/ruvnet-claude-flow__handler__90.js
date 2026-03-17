function __method_wrapper__() {
  handler: async (
    payload: WorkflowHookPayload,
    context: AgenticHookContext
  ): Promise<HookHandlerResult> => {
    const { workflowId, step, state } = payload;
    
    if (!step) {
      return { continue: true };
    }
    
    const sideEffects: SideEffect[] = [];
    
    // Measure step performance
    const stepStart = Date.now();
    
    // Check for step optimizations
    const optimizations = await getStepOptimizations(
      workflowId,
      step,
      context
    );
    
    if (optimizations.length > 0) {
      // Apply step optimizations
      const optimizedState = applyStepOptimizations(
        state,
        optimizations
      );
      
      sideEffects.push({
        type: 'log',
        action: 'write',
        data: {
          level: 'info',
          message: `Applied ${optimizations.length} optimizations to step ${step}`,
          data: { optimizations },
        },
      });
      
      return {
        continue: true,
        modified: true,
        payload: {
          ...payload,
          state: optimizedState,
        },
        sideEffects,
      };
    }
    
    // Track step execution
    sideEffects.push({
      type: 'memory',
      action: 'store',
      data: {
        key: `workflow:step:${workflowId}:${step}:${Date.now()}`,
        value: {
          step,
          state: summarizeState(state),
          timestamp: Date.now(),
        },
        ttl: 86400,
      },
    });
    
    return {
      continue: true,
      sideEffects,
    };
  },

}
