function __method_wrapper__() {
  async complete(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    
    try {
      // Use circuit breaker
      const response = await this.circuitBreaker.execute(async () => {
        return await this.doComplete(request);
      });
      
      // Track metrics
      const latency = Date.now() - startTime;
      this.trackRequest(request, response, latency);
      
      // Emit events
      this.emit('response', {
        provider: this.name,
        model: response.model,
        latency,
        tokens: response.usage.totalTokens,
        cost: response.cost?.totalCost,
      });
      
      return response;
    } catch (error) {
      this.errorCount++;
      
      // Transform to provider error
      const providerError = this.transformError(error);
      
      // Track error
      this.emit('error', {
        provider: this.name,
        error: providerError,
        request,
      });
      
      throw providerError;
    }
  }

}
