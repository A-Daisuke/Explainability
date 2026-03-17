function __method_wrapper__() {
  protected trackStreamRequest(
    request: LLMRequest,
    totalTokens: number,
    totalCost: number,
    latency: number
  ): void {
    this.requestCount++;
    this.totalTokens += totalTokens;
    this.totalCost += totalCost;
    
    // Store metrics
    const requestId = `stream-${Date.now()}`;
    this.requestMetrics.set(requestId, {
      timestamp: new Date(),
      model: request.model || this.config.model,
      tokens: totalTokens,
      cost: totalCost,
      latency,
      stream: true,
    });
  }

}
