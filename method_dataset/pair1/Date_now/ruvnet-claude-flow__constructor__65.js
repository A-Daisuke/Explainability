function __method_wrapper__() {
  constructor() {
    this.version = '2.5.0-alpha.131'; // Updated with Phase 4 SDK integration tools
    this.memoryStore = memoryStore; // Use shared singleton instance
    // Use the same memory system that already works
    this.capabilities = {
      tools: {
        listChanged: true,
      },
      resources: {
        subscribe: true,
        listChanged: true,
      },
    };
    this.sessionId = `session-cf-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    this.tools = this.initializeTools();
    this.resources = this.initializeResources();

    // Initialize shared memory store (same as npx commands)
    this.initializeMemory().catch((err) => {
      console.error(
        `[${new Date().toISOString()}] ERROR [claude-flow-mcp] Failed to initialize shared memory:`,
        err,
      );
    });

    // Database operations now use the same shared memory store as npx commands
  }

}
