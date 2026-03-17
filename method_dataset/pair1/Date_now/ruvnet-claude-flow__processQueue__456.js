function __method_wrapper__() {
  private async processQueue<T>(
    processor: (session: MCPSession, request: MCPRequest) => Promise<T>,
  ): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;

      // Check if request has expired
      if (Date.now() - item.timestamp > this.requestTimeout) {
        item.reject(new MCPError('Request timeout'));
        continue;
      }

      try {
        const result = await processor(item.session, item.request);
        item.resolve(result);
      } catch (error) {
        item.reject(error instanceof Error ? error : new Error(String(error)));
      }
    }

    this.processing = false;
  }

}
