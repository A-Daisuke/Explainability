function __method_wrapper__() {
  async initialize(): Promise<void> {
    if (this.initialized) {
      throw new InitializationError('Orchestrator already initialized');
    }

    this.logger.info('Initializing orchestrator...');
    const startTime = Date.now();

    try {
      // Initialize components in parallel where possible
      await Promise.all([
        this.initializeComponent('Terminal Manager', () => this.terminalManager.initialize()),
        this.initializeComponent('Memory Manager', () => this.memoryManager.initialize()),
        this.initializeComponent('Coordination Manager', () =>
          this.coordinationManager.initialize(),
        ),
      ]);

      // MCP server needs to be started after other components
      await this.initializeComponent('MCP Server', () => this.mcpServer.start());

      // Initialize Claude API client if configured
      if (this.configManager.isClaudeAPIConfigured()) {
        try {
          this.claudeClient = new ClaudeAPIClient(this.logger, this.configManager);
          this.logger.info('Claude API client initialized', {
            model: this.claudeClient.getConfig().model,
            temperature: this.claudeClient.getConfig().temperature,
          });
        } catch (error) {
          this.logger.warn('Failed to initialize Claude API client', error);
        }
      }

      // Initialize parallel executor and query controller
      this.parallelExecutor = new ParallelSwarmExecutor();
      this.queryController = new RealTimeQueryController({
        allowPause: true,
        allowModelChange: true,
        allowPermissionChange: true,
        monitoringInterval: 1000
      });

      this.logger.info('Session forking and query control initialized', {
        parallelExecutor: 'enabled',
        queryController: 'enabled'
      });

      // Restore persisted sessions
      await this.sessionManager.restoreSessions();

      // Set up event handlers
      this.setupEventHandlers();

      // Start background tasks
      this.startHealthChecks();
      this.startMaintenanceTasks();
      this.startMetricsCollection();

      this.initialized = true;

      const initDuration = Date.now() - startTime;
      this.eventBus.emit(SystemEvents.SYSTEM_READY, { timestamp: new Date() });
      this.logger.info('Orchestrator initialized successfully', { duration: initDuration });
    } catch (error) {
      this.logger.error('Failed to initialize orchestrator', error);

      // Attempt cleanup on initialization failure
      await this.emergencyShutdown();

      throw new InitializationError('Orchestrator', { error });
    }
  }

}
