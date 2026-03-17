function __method_wrapper__() {
  handler: async (
    payload: MemoryHookPayload,
    context: AgenticHookContext
  ): Promise<HookHandlerResult> => {
    const { namespace, key, value, ttl, provider } = payload;
    
    const sideEffects: SideEffect[] = [];
    
    // Validate memory constraints
    const validation = await validateMemoryStore(namespace, key, value, context);
    if (!validation.valid) {
      return {
        continue: false,
        sideEffects: [
          {
            type: 'log',
            action: 'write',
            data: {
              level: 'error',
              message: 'Memory store validation failed',
              data: validation,
            },
          },
        ],
      };
    }
    
    // Compress large values
    let processedValue = value;
    if (shouldCompress(value)) {
      processedValue = await compressValue(value);
      sideEffects.push({
        type: 'metric',
        action: 'increment',
        data: { name: 'memory.compressions' },
      });
    }
    
    // Add metadata
    const enrichedValue = {
      data: processedValue,
      metadata: {
        stored: Date.now(),
        provider,
        sessionId: context.sessionId,
        compressed: processedValue !== value,
        size: getValueSize(processedValue),
      },
    };
    
    // Track memory usage
    sideEffects.push({
      type: 'metric',
      action: 'update',
      data: {
        name: `memory.usage.${namespace}`,
        value: getValueSize(enrichedValue),
      },
    });
    
    return {
      continue: true,
      modified: true,
      payload: {
        ...payload,
        value: enrichedValue,
      },
      sideEffects,
    };
  },

}
