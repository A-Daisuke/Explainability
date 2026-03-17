function __method_wrapper__() {
  async callTool(
    name: string,
    args: Record<string, unknown>,
    context?: MCPContext
  ): Promise<CallToolResult> {
    const startTime = performance.now();
    let success = false;

    try {
      // Check cache first
      if (this.enableCaching) {
        const cached = this.checkCache(name, args);
        if (cached) {
          logger.debug('Cache hit for tool', { name });
          success = true;
          return cached;
        }
      }

      const tool = this.tools.get(name);
      if (!tool) {
        throw new Error(`Tool not found: ${name}`);
      }

      logger.debug('Executing tool in-process', { name, args });

      // Merge context
      const execContext: MCPContext = {
        ...this.context,
        ...context,
      };

      // Execute tool handler directly (in-process, no IPC!)
      const result = await tool.handler(args, execContext);

      // Cache result if applicable
      if (this.enableCaching && this.isCacheable(name)) {
        this.cacheResult(name, args, result);
      }

      success = true;

      // Return in MCP CallToolResult format
      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          },
        ],
        isError: false,
      };
    } catch (error) {
      logger.error('Tool execution failed', { name, error });
      success = false;

      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    } finally {
      // Record metrics
      if (this.enableMetrics) {
        const duration = performance.now() - startTime;
        this.recordMetric({
          toolName: name,
          duration,
          success,
          timestamp: Date.now(),
          transport: 'in-process',
        });
      }
    }
  }

}
