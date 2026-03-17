function __method_wrapper__() {
  private cleanupSessionRateLimiters(): void {
    // Remove rate limiters for sessions that haven't been used recently
    const cutoffTime = Date.now() - 300000; // 5 minutes ago
    let cleaned = 0;

    for (const [sessionId, rateLimiter] of this.sessionRateLimiters.entries()) {
      // If the rate limiter has full tokens, it hasn't been used recently
      if (rateLimiter.getTokens() === this.config.maxRequestsPerSecond) {
        this.sessionRateLimiters.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.debug('Cleaned up session rate limiters', { count: cleaned });
    }
  }

}
