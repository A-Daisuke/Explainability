function __method_wrapper__() {
  private parseNpmAuditResults(auditResult: any): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    if (auditResult.vulnerabilities) {
      for (const [packageName, vulnData] of Object.entries(auditResult.vulnerabilities)) {
        const vuln = vulnData as any;

        findings.push({
          id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `${vuln.severity} vulnerability in ${packageName}`,
          description: vuln.title || 'Vulnerability detected',
          severity: vuln.severity as SecuritySeverity,
          category: 'vulnerability',
          cve: vuln.cve,
          location: {
            file: 'package.json',
            component: packageName,
          },
          evidence: {
            snippet: `"${packageName}": "${vuln.range}"`,
            references: vuln.url ? [vuln.url] : [],
          },
          impact: vuln.overview || 'Security vulnerability',
          remediation: {
            description: vuln.recommendation || 'Update to a secure version',
            effort: 'low' as const,
            priority:
              vuln.severity === 'info'
                ? 'low'
                : (vuln.severity as 'low' | 'medium' | 'high' | 'critical'),
            autoFixable: true,
            steps: [`npm update ${packageName}`],
            references: vuln.url ? [vuln.url] : [],
          },
          status: 'open',
          tags: ['npm', 'dependency'],
          metadata: { packageName, range: vuln.range },
          firstSeen: new Date(),
          lastSeen: new Date(),
          occurrences: 1,
        });
      }
    }

    return findings;
  }

}
