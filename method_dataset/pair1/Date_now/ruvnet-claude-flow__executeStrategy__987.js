function __method_wrapper__() {
  private async executeStrategy(
    strategy: RecoveryStrategy,
    snapshot: SystemSnapshot,
    context: RecoveryContext
  ): Promise<boolean> {
    const startTime = Date.now();
    
    for (let attempt = 0; attempt <= strategy.retries; attempt++) {
      try {
        this.emit('strategy_attempt', { 
          strategy: strategy.name, 
          attempt: attempt + 1,
          maxAttempts: strategy.retries + 1
        });
        
        // Execute with timeout
        const success = await Promise.race([
          strategy.execute(snapshot, context),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Strategy timeout')), strategy.timeout)
          )
        ]);

        const duration = Date.now() - startTime;
        
        const recoveryAttempt: RecoveryAttempt = {
          strategy: strategy.name,
          timestamp: Date.now(),
          success,
          duration
        };
        
        this.recoveryHistory.push(recoveryAttempt);
        
        if (success) {
          this.emit('strategy_success', { strategy: strategy.name, attempt, duration });
          return true;
        }
        
      } catch (error) {
        const duration = Date.now() - startTime;
        
        const recoveryAttempt: RecoveryAttempt = {
          strategy: strategy.name,
          timestamp: Date.now(),
          success: false,
          error: error?.toString(),
          duration
        };
        
        this.recoveryHistory.push(recoveryAttempt);
        
        this.emit('strategy_failed', { 
          strategy: strategy.name, 
          attempt, 
          error: error?.toString(),
          duration 
        });
        
        if (attempt === strategy.retries) {
          return false; // All retries exhausted
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    
    return false;
  }

}
