function __method_wrapper__() {
  private async checkRateLimit(email: string): Promise<void> {
    const attempts = this.loginAttempts.get(email);
    const maxAttempts = this.config.maxLoginAttempts || 5;
    const lockoutDuration = this.config.lockoutDuration || 900000; // 15 minutes

    if (attempts && attempts.count >= maxAttempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
      if (timeSinceLastAttempt < lockoutDuration) {
        throw new AuthenticationError('Too many failed login attempts. Please try again later.');
      } else {
        // Reset attempts after lockout period
        this.loginAttempts.delete(email);
      }
    }
  }

}
