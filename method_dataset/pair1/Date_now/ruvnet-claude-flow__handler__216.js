function __method_wrapper__() {
  handler: async (
    payload: MemoryHookPayload,
    context: AgenticHookContext
  ): Promise<HookHandlerResult> => {
    const { namespace, key, value } = payload;
    
    if (!value) {
      return { continue: true };
    }
    
    const sideEffects: SideEffect[] = [];
    
    // Decompress if needed
    let processedValue = value;
    if (value.metadata?.compressed) {
      processedValue = await decompressValue(value.data);
      sideEffects.push({
        type: 'metric',
        action: 'increment',
        data: { name: 'memory.decompressions' },
      });
    }
    
    // Update access patterns
    await updateAccessPattern(namespace, key!, context);
    
    // Cache locally for fast access
    await cacheLocally(namespace, key!, processedValue, context);
    
    // Track retrieval latency
    const latency = Date.now() - context.timestamp;
    sideEffects.push({
      type: 'metric',
      action: 'update',
      data: {
        name: `memory.latency.${namespace}`,
        value: latency,
      },
    });
    
    return {
      continue: true,
      modified: true,
      payload: {
        ...payload,
        value: processedValue.data || processedValue,
      },
      sideEffects,
    };
  },

}
