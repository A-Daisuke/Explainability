function __method_wrapper__() {
  async runSequentialTests() {
    console.log('\n🔄 SEQUENTIAL EXECUTION MODE');
    console.log('═'.repeat(60));
    console.log('Running agent tests one after another...\n');
    
    const startTime = Date.now();
    const results = [];
    
    // Coordinator test
    console.log('1️⃣  Testing Coordinator Agent...');
    const coordinator = new CoordinatorAgent('coordinator-seq-001');
    results.push(await coordinator.orchestrateSwarmTask('Build authentication system', 3));
    
    // Researcher test
    console.log('2️⃣  Testing Researcher Agent...');
    const researcher = new ResearcherAgent('researcher-seq-001');
    results.push(await researcher.conductResearch('REST API best practices'));
    
    // Developer test
    console.log('3️⃣  Testing Developer Agent...');
    const developer = new DeveloperAgent('developer-seq-001');
    results.push(await developer.generateCode('user authentication'));
    
    // Analyzer test
    console.log('4️⃣  Testing Analyzer Agent...');
    const analyzer = new AnalyzerAgent('analyzer-seq-001');
    results.push(await analyzer.analyzePerformanceMetrics({
      response_times: [245, 312, 198, 580, 225],
      error_counts: { '4xx': 12, '5xx': 3 },
      cpu_usage: [45.2, 52.1, 48.7, 61.3],
      memory_usage: [1024, 1156, 1298, 1402]
    }));
    
    // Reviewer test
    console.log('5️⃣  Testing Reviewer Agent...');
    const reviewer = new ReviewerAgent('reviewer-seq-001');
    results.push(await reviewer.performCodeReview({
      title: 'Feature: Add user authentication',
      author: 'developer123',
      files: ['src/auth/login.ts', 'src/auth/logout.ts', 'tests/auth.test.ts']
    }));
    
    // Tester test
    console.log('6️⃣  Testing Tester Agent...');
    const tester = new TesterAgent('tester-seq-001');
    results.push(await tester.writeUnitTests('UserAuthentication'));
    
    // Documenter test
    console.log('7️⃣  Testing Documenter Agent...');
    const documenter = new DocumenterAgent('documenter-seq-001');
    results.push(await documenter.generateAPIDocumentation({
      name: 'User Authentication API',
      version: '1.0',
      endpoints: ['/auth/login', '/auth/validate', '/auth/refresh', '/auth/logout']
    }));
    
    // Monitor test
    console.log('8️⃣  Testing Monitor Agent...');
    const monitor = new MonitorAgent('monitor-seq-001');
    results.push(await monitor.monitorSystemHealth());
    
    // Specialist test
    console.log('9️⃣  Testing Specialist Agent...');
    const specialist = new SpecialistAgent('specialist-seq-001');
    results.push(await specialist.provideMachineLearningExpertise('Customer churn prediction'));
    
    const totalTime = Date.now() - startTime;
    
    console.log('\n✅ Sequential execution completed');
    console.log(`Total time: ${totalTime}ms`);
    console.log(`Tasks completed: ${results.length}`);
    
    return { mode: 'sequential', totalTime, taskCount: results.length };
  }

}
