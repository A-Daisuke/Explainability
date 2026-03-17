function __method_wrapper__() {
    return new Promise((resolve, reject) => {
      const findings: SecurityFinding[] = [];

      // Mock Trivy execution
      const mockFindings = [
        {
          id: `finding-${Date.now()}-1`,
          title: 'CVE-2023-12345: Remote Code Execution in libxml2',
          description: 'A buffer overflow vulnerability in libxml2 allows remote code execution',
          severity: 'critical' as const,
          category: 'vulnerability' as const,
          cve: 'CVE-2023-12345',
          cvss: {
            score: 9.8,
            vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
            version: '3.1',
          },
          location: {
            file: 'package-lock.json',
            line: 125,
            component: 'libxml2@2.9.10',
          },
          evidence: {
            snippet: '"libxml2": "2.9.10"',
            context: 'Dependency declaration',
            references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-12345'],
          },
          impact: 'Remote attackers could execute arbitrary code',
          remediation: {
            description: 'Update libxml2 to version 2.9.14 or later',
            effort: 'low' as const,
            priority: 'critical' as const,
            autoFixable: true,
            steps: ['npm update libxml2'],
            references: ['https://github.com/GNOME/libxml2/releases'],
          },
          status: 'open' as const,
          tags: ['cve', 'rce', 'dependency'],
          metadata: {},
          firstSeen: new Date(),
          lastSeen: new Date(),
          occurrences: 1,
        },
      ];

      // Simulate scan delay
      setTimeout(() => {
        resolve(mockFindings);
      }, 2000);
    });

}
