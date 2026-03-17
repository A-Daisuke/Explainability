function __method_wrapper__() {
  recordRequestStart(session: MCPSession, request: MCPRequest): RequestMetrics {
    const requestMetrics: RequestMetrics = {
      requestId: request.id.toString(),
      sessionId: session.id,
      method: request.method,
      startTime: Date.now(),
    };

    this.metrics.totalRequests++;
    this.updateRequestsPerSecond();

    this.logger.debug('Request started', {
      requestId: requestMetrics.requestId,
      sessionId: session.id,
      method: request.method,
    });

    return requestMetrics;
  }

}
