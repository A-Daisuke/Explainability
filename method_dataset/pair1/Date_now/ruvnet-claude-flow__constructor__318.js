class __C__ {
  constructor(
    private config: Config,
    private terminalManager: ITerminalManager,
    private memoryManager: IMemoryManager,
    private coordinationManager: ICoordinationManager,
    private mcpServer: IMCPServer,
    private eventBus: IEventBus,
    private logger: ILogger,
  ) {
    this.sessionManager = new SessionManager(
      terminalManager,
      memoryManager,
      eventBus,
      logger,
      config,
    );

    this.configManager = ConfigManager.getInstance();

    // Initialize circuit breakers
    this.healthCheckCircuitBreaker = circuitBreaker('HealthCheck', {
      threshold: 3,
      timeout: 10000,
      resetTimeout: 30000,
    });

    this.taskAssignmentCircuitBreaker = circuitBreaker('TaskAssignment', {
      threshold: 5,
      timeout: 5000,
      resetTimeout: 20000,
    });
  }

}
