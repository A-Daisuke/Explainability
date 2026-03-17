function __method_wrapper__() {
  private checkRateLimit(channel: AlertChannel, alert: TruthAlert): boolean {
    for (const rateLimit of channel.rateLimits) {
      const now = Date.now();
      
      // Reset if window has passed
      if (rateLimit.resetTime && now > rateLimit.resetTime.getTime()) {
        rateLimit.currentCount = 0;
        rateLimit.resetTime = new Date(now + rateLimit.window);
      }
      
      // Initialize if needed
      if (!rateLimit.resetTime) {
        rateLimit.resetTime = new Date(now + rateLimit.window);
        rateLimit.currentCount = 0;
      }
      
      // Check limit
      if (rateLimit.currentCount >= rateLimit.maxAlerts) {
        return false;
      }
      
      // Increment counter
      rateLimit.currentCount++;
    }
    
    return true;
  }

}
