function __method_wrapper__() {
  async *streamComplete(request: LLMRequest): AsyncIterable<LLMStreamEvent> {
    const startTime = Date.now();
    let totalTokens = 0;
    let totalCost = 0;
    
    try {
      // Check if streaming is supported
      if (!this.capabilities.supportsStreaming) {
        throw new LLMProviderError(
          'Streaming not supported',
          'STREAMING_NOT_SUPPORTED',
          this.name,
          undefined,
          false
        );
      }
      
      // Use circuit breaker
      const stream = await this.circuitBreaker.execute(async () => {
        return this.doStreamComplete(request);
      });
      
      // Process stream
      for await (const event of stream) {
        if (event.usage) {
          totalTokens = event.usage.totalTokens;
        }
        if (event.cost) {
          totalCost = event.cost.totalCost;
        }
        
        yield event;
      }
      
      // Track metrics
      const latency = Date.now() - startTime;
      this.trackStreamRequest(request, totalTokens, totalCost, latency);
      
    } catch (error) {
      this.errorCount++;
      
      // Transform to provider error
      const providerError = this.transformError(error);
      
      // Yield error event
      yield {
        type: 'error',
        error: providerError,
      };
      
      throw providerError;
    }
  }

}
