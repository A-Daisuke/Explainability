function __method_wrapper__() {
  private async createConnection(): Promise<PooledConnection> {
    const id = `conn-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const api = new ClaudeAPI();

    const connection: PooledConnection = {
      id,
      api,
      inUse: false,
      createdAt: new Date(),
      lastUsedAt: new Date(),
      useCount: 0,
    };

    this.connections.set(id, connection);
    this.emit('connection:created', connection);

    return connection;
  }

}
