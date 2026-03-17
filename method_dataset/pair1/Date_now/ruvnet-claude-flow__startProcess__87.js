function __method_wrapper__() {
  async startProcess(processId: string): Promise<void> {
    const process = this.processes.get(processId);
    if (!process) {
      throw new Error(`Unknown process: ${processId}`);
    }

    if (process.status === ProcessStatus.RUNNING) {
      throw new Error(`Process ${processId} is already running`);
    }

    this.updateProcessStatus(processId, ProcessStatus.STARTING);

    try {
      switch (process.type) {
        case ProcessType.EVENT_BUS:
          // Event bus is already initialized globally
          process.pid = Deno.pid;
          break;

        case ProcessType.MEMORY_MANAGER:
          this.memoryManager = new MemoryManager(this.config.memory, eventBus, logger);
          await this.memoryManager.initialize();
          break;

        case ProcessType.TERMINAL_POOL:
          this.terminalManager = new TerminalManager(this.config.terminal, eventBus, logger);
          await this.terminalManager.initialize();
          break;

        case ProcessType.COORDINATOR:
          this.coordinationManager = new CoordinationManager(
            this.config.coordination,
            eventBus,
            logger,
          );
          await this.coordinationManager.initialize();
          break;

        case ProcessType.MCP_SERVER:
          this.mcpServer = new MCPServer(this.config.mcp, eventBus, logger);
          await this.mcpServer.start();
          break;

        case ProcessType.ORCHESTRATOR:
          if (
            !this.terminalManager ||
            !this.memoryManager ||
            !this.coordinationManager ||
            !this.mcpServer
          ) {
            throw new Error('Required components not initialized');
          }

          this.orchestrator = new Orchestrator(
            this.config,
            this.terminalManager,
            this.memoryManager,
            this.coordinationManager,
            this.mcpServer,
            eventBus,
            logger,
          );
          await this.orchestrator.initialize();
          break;
      }

      process.startTime = Date.now();
      this.updateProcessStatus(processId, ProcessStatus.RUNNING);
      this.emit('processStarted', { processId, process });
    } catch (error) {
      this.updateProcessStatus(processId, ProcessStatus.ERROR);
      process.metrics = {
        ...process.metrics,
        lastError: (error as Error).message,
      };
      this.emit('processError', { processId, error });
      throw error;
    }
  }

}
