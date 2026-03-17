function createMockContext(overrides?: Partial<AgenticHookContext>): AgenticHookContext {
  return {
    sessionId: 'test-session',
    timestamp: Date.now(),
    correlationId: 'test-correlation',
    metadata: {},
    memory: {
      namespace: 'test',
      provider: 'memory',
      cache: new Map(),
    },
    neural: {
      modelId: 'test-model',
      patterns: {
        add: () => {},
        get: () => undefined,
        findSimilar: () => [],
        getByType: () => [],
        prune: () => {},
        export: () => [],
        import: () => {},
      },
      training: {
        epoch: 0,
        loss: 0,
        accuracy: 0,
        learningRate: 0.001,
        optimizer: 'adam',
        checkpoints: [],
      },
    },
    performance: {
      metrics: new Map(),
      bottlenecks: [],
      optimizations: [],
    },
    ...overrides,
  };
}
