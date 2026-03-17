function __method_wrapper__() {
  handler: async (
    payload: PerformanceHookPayload,
    context: AgenticHookContext
  ): Promise<HookHandlerResult> => {
    const { bottleneck } = payload;
    
    if (!bottleneck) {
      return { continue: true };
    }
    
    const sideEffects: SideEffect[] = [];
    
    // Analyze bottleneck severity
    const analysis: BottleneckAnalysis = {
      component: bottleneck.location,
      severity: mapSeverity(bottleneck.severity),
      impact: bottleneck.severity / 10, // Normalize to 0-1
      suggestions: bottleneck.suggestions,
    };
    
    context.performance.bottlenecks.push(analysis);
    
    // Store for historical analysis
    sideEffects.push({
      type: 'memory',
      action: 'store',
      data: {
        key: `bottleneck:${analysis.component}:${Date.now()}`,
        value: analysis,
        ttl: 86400, // 24 hours
      },
    });
    
    // Check for recurring bottlenecks
    const recurrence = await checkBottleneckRecurrence(
      analysis.component,
      context
    );
    
    if (recurrence.count > 3) {
      // Recurring bottleneck - escalate
      sideEffects.push({
        type: 'notification',
        action: 'emit',
        data: {
          event: 'performance:bottleneck:recurring',
          data: {
            component: analysis.component,
            occurrences: recurrence.count,
            timespan: recurrence.timespan,
          },
        },
      });
      
      // Generate advanced optimization
      const optimization = await generateAdvancedOptimization(
        analysis,
        recurrence,
        context
      );
      
      if (optimization) {
        context.performance.optimizations.push(optimization);
      }
    }
    
    // Correlate with other metrics
    const correlations = await findMetricCorrelations(
      analysis.component,
      context
    );
    
    if (correlations.length > 0) {
      sideEffects.push({
        type: 'log',
        action: 'write',
        data: {
          level: 'info',
          message: 'Bottleneck correlations found',
          data: { bottleneck: analysis, correlations },
        },
      });
    }
    
    return {
      continue: true,
      sideEffects,
    };
  },

}
