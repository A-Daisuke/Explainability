function __method_wrapper__() {
  private async createSwarm(req: any, res: any): Promise<void> {
    try {
      const request = req.body as SwarmCreateRequest;
      
      // Validate request
      if (!request.name || !request.topology) {
        return res.status(400).json({
          error: 'Name and topology are required',
          code: 'VALIDATION_ERROR',
        });
      }

      // Create swarm configuration
      const swarmConfig: SwarmConfig = {
        name: request.name,
        topology: request.topology,
        maxAgents: request.maxAgents || 8,
        strategy: request.strategy || 'balanced',
        ...request.config,
      };

      // Generate swarm ID
      const swarmId = `swarm_${Date.now()}_${nanoid(10)}`;

      // Create swarm coordinator
      const swarm = new SwarmCoordinator(
        swarmId,
        swarmConfig,
        this.logger,
        this.claudeClient,
        this.configManager,
        this.coordinationManager,
        this.agentManager,
        this.resourceManager,
      );

      // Initialize swarm
      await swarm.initialize();

      // Store swarm
      this.swarms.set(swarmId, swarm);

      this.logger.info('Swarm created', {
        swarmId,
        name: request.name,
        topology: request.topology,
      });

      res.status(201).json({
        swarmId,
        name: request.name,
        topology: request.topology,
        maxAgents: swarmConfig.maxAgents,
        strategy: swarmConfig.strategy,
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      throw error;
    }
  }

}
