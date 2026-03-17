function __method_wrapper__() {
  beforeEach(async () => {
    logger = new Logger();
    await logger.configure({
      level: 'debug',
      format: 'text',
      destination: 'console',
    });

    eventBus = new EventBus(logger);
    mockOrchestrator = new MockOrchestrator();

    config = {
      transport: 'stdio',
      host: 'localhost',
      port: 3001,
      tlsEnabled: false,
      auth: {
        enabled: false,
        method: 'token',
      },
      loadBalancer: {
        enabled: true,
        strategy: 'round-robin',
        maxRequestsPerSecond: 100,
        healthCheckInterval: 30000,
        circuitBreakerThreshold: 5,
      },
      sessionTimeout: 60000,
      maxSessions: 10,
      enableMetrics: true,
      corsEnabled: true,
      corsOrigins: ['*'],
    };

    server = new MCPServer(config, eventBus, logger, mockOrchestrator);
  });

}
