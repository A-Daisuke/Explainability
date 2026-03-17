function __method_wrapper__() {
  private ruleMatches(rule: PermissionRule, query: PermissionQuery): boolean {
    // Exact match
    if (rule.toolName === query.toolName) {
      return this.ruleContentMatches(rule, query);
    }

    // Wildcard match
    if (rule.toolName === '*') {
      return this.ruleContentMatches(rule, query);
    }

    // Pattern match (simple glob-style)
    if (rule.toolName.includes('*')) {
      const pattern = rule.toolName.replace(/\*/g, '.*');
      if (new RegExp(`^${pattern}$`).test(query.toolName)) {
        return this.ruleContentMatches(rule, query);
      }
    }

    return false;
  }

}
