function __method_wrapper__() {
    test('should detect fabricated or inconsistent evidence', async () => {
      const reviewer = mockAgents.get('reviewer-001')!;
      
      const message: AgentMessage = {
        id: 'test-msg-2',
        from: 'coder-001',
        to: reviewer.id,
        type: 'result',
        content: { 
          task: 'optimize-database',
          claimed_success: true,
          performance_improved: true
        },
        timestamp: Date.now(),
        hash: 'test-hash-2'
      };

      // Inconsistent evidence
      const inconsistentEvidence = {
        actual_success: true,
        performance_metrics: {
          before: { query_time: 100 },
          after: { query_time: 200 } // Actually worse!
        },
        quality: 0.9 // High quality score doesn't match actual results
      };

      const verification = reviewer.verifyMessage(message, inconsistentEvidence);
      
      // Should detect inconsistency between claimed improvement and actual metrics
      expect(verification.conflicts.length).toBeGreaterThan(0);
      expect(verification.truthScore).toBeLessThan(0.6);
    });

}
