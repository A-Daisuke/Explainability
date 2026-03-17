function __method_wrapper__() {
  private findRule(query: PermissionQuery, level: PermissionLevel): PermissionRule | undefined {
    const config = this.getConfigForLevel(level);
    if (!config) return undefined;

    // Check if mode bypasses rules
    if (config.mode === 'bypassPermissions') {
      return {
        toolName: '*',
        behavior: 'allow',
        scope: level,
        priority: 1000,
        timestamp: Date.now(),
      };
    }

    // Find matching rule with highest priority
    return config.rules
      .filter(rule => this.ruleMatches(rule, query))
      .sort((a, b) => b.priority - a.priority)[0];
  }

}
