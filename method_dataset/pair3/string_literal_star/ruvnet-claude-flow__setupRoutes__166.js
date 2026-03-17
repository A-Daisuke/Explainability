function __method_wrapper__() {
  private setupRoutes(): void {
    // Get current file directory for static files
    const __filename =
      typeof import.meta?.url !== 'undefined'
        ? fileURLToPath(import.meta.url)
        : __filename || __dirname + '/http.ts';
    const __dirname = dirname(__filename);
    const consoleDir = join(__dirname, '../../ui/console');

    // Serve static files for the web console
    this.app.use('/console', express.static(consoleDir));

    // Web console route
    this.app.get('/', (req, res) => {
      res.redirect('/console');
    });

    this.app.get('/console', (req, res) => {
      res.sendFile(join(consoleDir, 'index.html'));
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // MCP JSON-RPC endpoint
    this.app.post('/rpc', async (req, res) => {
      await this.handleJsonRpcRequest(req, res);
    });

    // Handle preflight requests
    this.app.options('*', (req, res) => {
      res.status(204).end();
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Not found' });
    });

    // Error handler
    this.app.use(
      (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.logger.error('Express error', err);
        res.status(500).json({
          error: 'Internal server error',
          message: err.message,
        });
      },
    );
  }

}
