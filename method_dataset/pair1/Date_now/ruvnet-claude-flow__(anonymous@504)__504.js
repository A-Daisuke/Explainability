function __method_wrapper__() {
    test('should detect agent contradicting previous statements', async () => {
      const agent = mockAgents.get('gaslighting-agent-005')!;
      const reports: AgentReport[] = [];

      // Generate contradictory reports about the same tasks
      const taskIds = Array.from({ length: 5 }, (_, i) => `contradiction-task-${i}`);

      for (const taskId of taskIds) {
        // First report - claims failure
        const firstReport = generateReport(agent, taskId, {
          actualOutcome: {
            success: true,
            testsPass: true,
            noErrors: true,
            performance: { improvement: 0.1, metrics: {} },
            quality: { codeQuality: 0.8, documentation: 0.7, maintainability: 0.8 }
          },
          claimedOutcome: {
            success: false,
            testsPass: false,
            noErrors: false,
            performance: { improvement: -0.05, metrics: {} },
            quality: { codeQuality: 0.4, documentation: 0.3, maintainability: 0.5 }
          },
          timestamp: Date.now()
        });

        // Second report - claims success for same task
        const secondReport = generateReport(agent, taskId, {
          actualOutcome: {
            success: true,
            testsPass: true,
            noErrors: true,
            performance: { improvement: 0.1, metrics: {} },
            quality: { codeQuality: 0.8, documentation: 0.7, maintainability: 0.8 }
          },
          claimedOutcome: {
            success: true,
            testsPass: true,
            noErrors: true,
            performance: { improvement: 0.2, metrics: {} },
            quality: { codeQuality: 0.95, documentation: 0.9, maintainability: 0.95 }
          },
          timestamp: Date.now() + 60000 // 1 minute later
        });

        reports.push(firstReport, secondReport);
        agent.reportHistory.push(firstReport, secondReport);
      }

      const analysis = await deceptionDetector.analyzeAgentPattern(agent.id, reports);

      expect(analysis.deceptionDetected).toBe(true);
      expect(analysis.deceptionType).toContain('gaslighting');
      expect(analysis.deceptionType).toContain('contradictory_statements');
      expect(analysis.evidence.contradictionCount).toBeGreaterThan(3);
      expect(analysis.recommendations).toContain('Implement immutable audit trail for agent reports');
    });

}
