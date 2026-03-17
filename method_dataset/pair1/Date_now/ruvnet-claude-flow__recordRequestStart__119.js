function __method_wrapper__() {
  recordRequestStart(request: MCPRequest, session: MCPSession): string {
    const requestId = `${request.id}_${Date.now()}`;
    const metrics: RequestMetrics = {
      id: requestId,
      method: request.method,
      sessionId: session.id,
      startTime: performance.now(),
      requestSize: this.calculateRequestSize(request),
    };

    this.requestMetrics.set(requestId, metrics);

    this.logger.debug('Request started', {
      requestId,
      method: request.method,
      sessionId: session.id,
    });

    return requestId;
  }

}
