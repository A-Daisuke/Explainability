function __method_wrapper__() {
  createAlertRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'lastModified'>): string {
    const ruleId = `rule-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    const fullRule: AlertRule = {
      ...rule,
      id: ruleId,
      createdAt: new Date(),
      lastModified: new Date(),
    };
    
    this.alertRules.set(ruleId, fullRule);
    
    this.logger.info('Alert rule created', {
      ruleId,
      name: rule.name,
      metric: rule.metric,
      threshold: rule.threshold,
    });
    
    return ruleId;
  }

}
