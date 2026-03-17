function __method_wrapper__() {
  private cleanupExpiredRequests(): void {
    const now = Date.now();
    let cleaned = 0;

    this.queue = this.queue.filter((item) => {
      if (now - item.timestamp > this.requestTimeout) {
        item.reject(new MCPError('Request timeout'));
        cleaned++;
        return false;
      }
      return true;
    });

    if (cleaned > 0) {
      this.logger.warn('Cleaned up expired requests from queue', { count: cleaned });
    }
  }

}
