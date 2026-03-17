function __method_wrapper__() {
  async match(
    hook: HookRegistration,
    context: AgenticHookContext,
    payload: any
  ): Promise<MatchResult> {
    const startTime = Date.now();

    // Generate cache key
    const cacheKey = this.generateCacheKey(hook, context, payload);

    // Check cache
    if (this.cacheEnabled) {
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
        return {
          matched: cached.result,
          matchedRules: cached.rules,
          executionTime: Date.now() - startTime,
          cacheHit: true,
        };
      }
    }

    // Extract rules from hook filter
    const rules = this.extractRules(hook.filter);
    if (rules.length === 0) {
      // No filter means hook matches all
      return {
        matched: true,
        matchedRules: ['*'],
        executionTime: Date.now() - startTime,
        cacheHit: false,
      };
    }

    // Evaluate rules
    const matchedRules: string[] = [];
    const results: boolean[] = [];

    for (const rule of rules) {
      const ruleResult = await this.evaluateRule(rule, context, payload);
      results.push(ruleResult);

      if (ruleResult) {
        matchedRules.push(this.getRuleName(rule));
      }
    }

    // Apply match strategy
    const matched = this.matchStrategy === 'all'
      ? results.every(r => r)
      : results.some(r => r);

    // Cache result
    if (this.cacheEnabled) {
      this.cache.set(cacheKey, {
        result: matched,
        timestamp: Date.now(),
        rules: matchedRules,
      });
    }

    return {
      matched,
      matchedRules,
      executionTime: Date.now() - startTime,
      cacheHit: false,
    };
  }

}
