function __method_wrapper__() {
  registerQuery(queryId: string, agentId: string, query: Query): ControlledQuery {
    const controlled: ControlledQuery = {
      queryId,
      agentId,
      query,
      status: 'running',
      isPaused: false,
      canControl: true,
      startTime: Date.now()
    };

    this.controlledQueries.set(queryId, controlled);
    this.startMonitoring(queryId);

    this.logger.info('Query registered for control', { queryId, agentId });
    this.emit('query:registered', { queryId, agentId });

    return controlled;
  }

}
