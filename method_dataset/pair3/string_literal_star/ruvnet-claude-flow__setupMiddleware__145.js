function __method_wrapper__() {
  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS middleware
    if (this.config?.corsEnabled) {
      const origins = this.config.corsOrigins || ['*'];
      this.app.use(
        cors({
          origin: origins,
          credentials: true,
          maxAge: 86400, // 24 hours
        }),
      );
    }

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.text());
  }

}
