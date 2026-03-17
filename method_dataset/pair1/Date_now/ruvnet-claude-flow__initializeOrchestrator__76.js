function __method_wrapper__() {
  async initializeOrchestrator(): Promise<MaestroSwarmCoordinator> {
    const startTime = Date.now();

    try {
      if (this.swarmCoordinator && this.initialized) {
        console.log(chalk.green('✅ Using cached Maestro swarm coordinator'));
        return this.swarmCoordinator;
      }

      console.log(chalk.blue('🚀 Initializing Maestro orchestrator...'));

      // Parallel initialization with caching
      const [config, eventBus, logger, memoryManager, agentManager, mainOrchestrator] = 
        await Promise.all([
          this.getOrCreateConfig(),
          this.getOrCreateEventBus(),
          this.getOrCreateLogger(),
          this.getOrCreateMemoryManager(),
          this.getOrCreateAgentManager(),
          this.getOrCreateMainOrchestrator()
        ]);

      // Create optimized Maestro configuration
      const maestroConfig = this.getOptimizedMaestroConfig();

      // Initialize native swarm coordinator
      this.swarmCoordinator = new MaestroSwarmCoordinator(
        maestroConfig,
        eventBus,
        logger
      );

      // Initialize native hive mind swarm with performance monitoring
      await this.executeWithMonitoring('swarm_init', async () => {
        const swarmId = await this.swarmCoordinator!.initialize();
        console.log(chalk.green(`✅ Native hive mind swarm initialized: ${swarmId}`));
      });

      this.initialized = true;
      const duration = Date.now() - startTime;
      
      console.log(chalk.green(`✅ Maestro orchestrator ready (${duration}ms)`));
      
      // Report performance metrics
      await this.reportPerformanceMetric('orchestrator_init', duration, true);

      return this.swarmCoordinator;

    } catch (error) {
      const duration = Date.now() - startTime;
      await this.reportPerformanceMetric('orchestrator_init', duration, false, error instanceof Error ? error.message : String(error));
      
      console.error(chalk.red(`❌ Failed to initialize Maestro orchestrator: ${error instanceof Error ? error.message : String(error)}`));
      throw error;
    }
  }

}
