function __method_wrapper__() {
  async checkLimit() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const resetTime = oldestRequest + this.windowMs;
      const waitTime = resetTime - now;
      
      throw new GitHubCliRateLimitError(
        `Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds`
      );
    }
    
    this.requests.push(now);
  }

}
