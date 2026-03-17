function __method_wrapper__() {
  private async initializeDefaultFrameworks(): Promise<void> {
    const defaultFrameworks = [
      {
        name: 'SOC 2 Type II',
        version: '2017',
        description: 'Service Organization Control 2 Type II compliance framework',
        type: 'certification' as const,
        requirements: [
          {
            title: 'Security Principle - Logical and Physical Access Controls',
            description: 'The entity restricts logical and physical access to the system',
            category: 'access-control',
            priority: 'high' as const,
            status: 'compliant' as const,
            evidence: [],
            gaps: [],
            remediation: {
              actions: [],
              owner: 'security-team',
              dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            },
            lastAssessed: new Date(),
            nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            automatedCheck: {
              enabled: true,
              frequency: 'daily',
              query: 'category:authentication AND outcome:failure',
              threshold: 10,
            },
          },
        ],
        controls: [
          {
            name: 'Multi-Factor Authentication',
            description: 'MFA is required for all user accounts',
            type: 'preventive' as const,
            automationType: 'automated' as const,
            effectiveness: 'high' as const,
            frequency: 'continuous',
            owner: 'security-team',
            evidence: [],
            testingProcedure: 'Verify MFA is enabled for all user accounts',
            lastTested: new Date(),
            nextTest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            status: 'effective' as const,
          },
        ],
        auditFrequency: 'quarterly' as const,
        retentionPeriod: '7y',
        responsible: 'compliance-officer',
      },
      {
        name: 'GDPR',
        version: '2018',
        description: 'General Data Protection Regulation compliance framework',
        type: 'regulatory' as const,
        requirements: [
          {
            title: 'Data Processing Records',
            description: 'Maintain records of all data processing activities',
            category: 'data-protection',
            priority: 'critical' as const,
            status: 'compliant' as const,
            evidence: [],
            gaps: [],
            remediation: {
              actions: [],
              owner: 'data-protection-officer',
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            lastAssessed: new Date(),
            nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            automatedCheck: {
              enabled: true,
              frequency: 'daily',
              query: 'category:data-access AND details.pii:true',
            },
          },
        ],
        controls: [],
        auditFrequency: 'annually' as const,
        retentionPeriod: '6y',
        responsible: 'data-protection-officer',
      },
    ];

    for (const frameworkData of defaultFrameworks) {
      if (!Array.from(this.frameworks.values()).some((f) => f.name === frameworkData.name)) {
        await this.createComplianceFramework(frameworkData);
      }
    }
  }

}
