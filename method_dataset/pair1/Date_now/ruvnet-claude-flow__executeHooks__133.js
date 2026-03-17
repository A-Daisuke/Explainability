function __method_wrapper__() {
  async executeHooks(
    type: AgenticHookType,
    payload: HookPayload,
    context: AgenticHookContext
  ): Promise<HookHandlerResult[]> {
    const executionId = this.generateExecutionId();
    this.activeExecutions.add(executionId);

    const startTime = Date.now();
    const results: HookHandlerResult[] = [];

    try {
      // Get all hooks for this type
      const allHooks = this.hooks.get(type) || [];

      // Use hook matcher to filter applicable hooks (2-3x performance improvement)
      const matchedHooks: HookRegistration[] = [];
      for (const hook of allHooks) {
        const matchResult = await this.hookMatcher.match(hook, context, payload);
        if (matchResult.matched) {
          matchedHooks.push(hook);

          // Track matcher performance
          this.updateMetric('hooks.matcher.executionTime', matchResult.executionTime);
          if (matchResult.cacheHit) {
            this.updateMetric('hooks.matcher.cacheHits', 1);
          }
        }
      }

      logger.debug(`Executing ${matchedHooks.length}/${allHooks.length} matched hooks for type '${type}'`);
      this.emit('hooks:executing', {
        type,
        total: allHooks.length,
        matched: matchedHooks.length,
        executionId
      });

      // Execute matched hooks in order
      let modifiedPayload = payload;
      for (const hook of matchedHooks) {
        try {
          const result = await this.executeHook(hook, modifiedPayload, context);
          results.push(result);

          // Handle side effects
          if (result.sideEffects) {
            await this.processSideEffects(result.sideEffects, context);
          }

          // Update payload if modified
          if (result.modified && result.payload) {
            modifiedPayload = result.payload;
          }

          // Check if we should continue
          if (!result.continue) {
            logger.debug(`Hook '${hook.id}' halted execution chain`);
            break;
          }
        } catch (error) {
          await this.handleHookError(hook, error as Error, context);

          // Determine if we should continue after error
          if (hook.options?.errorHandler) {
            hook.options.errorHandler(error as Error);
          } else {
            throw error; // Re-throw if no error handler
          }
        }
      }
      
      // Update metrics
      const duration = Date.now() - startTime;
      this.updateMetric('hooks.executions', 1);
      this.updateMetric('hooks.totalDuration', duration);
      this.updateMetric(`hooks.${type}.executions`, 1);
      this.updateMetric(`hooks.${type}.duration`, duration);
      
      this.emit('hooks:executed', { 
        type, 
        results, 
        duration, 
        executionId 
      });
      
      return results;
    } finally {
      this.activeExecutions.delete(executionId);
    }
  }

}
