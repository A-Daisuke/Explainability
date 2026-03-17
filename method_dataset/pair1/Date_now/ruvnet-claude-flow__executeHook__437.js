function __method_wrapper__() {
  private async executeHook(
    hook: HookRegistration,
    payload: HookPayload,
    context: AgenticHookContext
  ): Promise<HookHandlerResult> {
    const startTime = Date.now();
    
    try {
      // Check cache if enabled
      if (hook.options?.cache?.enabled) {
        const cacheKey = hook.options.cache.key(payload);
        const cached = this.getCachedResult(hook.id, cacheKey);
        if (cached) {
          this.updateMetric('hooks.cacheHits', 1);
          return cached;
        }
      }
      
      // Execute with timeout if specified
      let resultPromise = hook.handler(payload, context);
      
      if (hook.options?.timeout) {
        resultPromise = this.withTimeout(
          resultPromise, 
          hook.options.timeout,
          `Hook '${hook.id}' timed out`
        );
      }
      
      const result = await resultPromise;
      
      // Cache result if enabled
      if (hook.options?.cache?.enabled && result) {
        const cacheKey = hook.options.cache.key(payload);
        this.cacheResult(hook.id, cacheKey, result, hook.options.cache.ttl);
      }
      
      // Update hook-specific metrics
      const duration = Date.now() - startTime;
      this.updateMetric(`hooks.${hook.id}.executions`, 1);
      this.updateMetric(`hooks.${hook.id}.duration`, duration);
      
      return result;
    } catch (error) {
      // Handle retries if configured
      if (hook.options?.retries && hook.options.retries > 0) {
        logger.warn(`Hook '${hook.id}' failed, retrying...`);
        return this.retryHook(hook, payload, context, hook.options.retries);
      }
      
      // Use fallback if provided
      if (hook.options?.fallback) {
        logger.warn(`Hook '${hook.id}' failed, using fallback`);
        return hook.options.fallback(payload, context);
      }
      
      throw error;
    }
  }

}
