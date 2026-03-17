function __method_wrapper__() {
  private async generateCriticalIssues(data: any): Promise<CriticalIssue[]> {
    const { systemMetrics, agentScores, activeAlerts } = data;
    const issues: CriticalIssue[] = [];
    
    // System-wide issues
    if (systemMetrics.overallAccuracy < 0.9) {
      issues.push({
        id: 'system-accuracy-low',
        severity: 'critical',
        description: `System accuracy (${(systemMetrics.overallAccuracy * 100).toFixed(1)}%) below target`,
        affectedAgents: ['system-wide'],
        impact: 'High risk of incorrect outputs across all agents',
        eta: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });
    }
    
    // Agent-specific issues
    const problematicAgents = agentScores.filter(score => 
      score.riskAssessment.level === 'critical' || score.riskAssessment.level === 'high'
    );
    
    if (problematicAgents.length > 0) {
      issues.push({
        id: 'agents-at-risk',
        severity: problematicAgents.some(a => a.riskAssessment.level === 'critical') ? 'critical' : 'high',
        description: `${problematicAgents.length} agents at risk`,
        affectedAgents: problematicAgents.map(a => a.agentId),
        impact: 'Reduced system reliability and increased intervention needs',
        eta: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      });
    }
    
    // Alert-based issues
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical' || a.severity === 'emergency');
    if (criticalAlerts.length > 5) {
      issues.push({
        id: 'high-alert-volume',
        severity: 'high',
        description: `${criticalAlerts.length} critical alerts active`,
        affectedAgents: [...new Set(criticalAlerts.map(a => a.source))],
        impact: 'System may be overwhelmed, requiring immediate attention',
        eta: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      });
    }
    
    return issues.slice(0, 5); // Top 5 issues
  }

}
