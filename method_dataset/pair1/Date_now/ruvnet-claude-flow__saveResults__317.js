function __method_wrapper__() {
  async saveResults() {
    const timestamp = new Date().toISOString();
    const results = {
      timestamp,
      totalTests: this.testCount,
      passed: this.passedCount,
      failed: this.testCount - this.passedCount,
      details: this.testResults,
      dbPath: this.dbPath,
      dbSize: fs.existsSync(this.dbPath) ? fs.statSync(this.dbPath).size : 0
    };

    // Store results using MCP
    execSync(
      `npx claude-flow@alpha mcp call memory_usage '{"action": "store", "key": "test_results_${Date.now()}", "value": ${JSON.stringify(JSON.stringify(results))}, "namespace": "test_results"}'`,
      { encoding: 'utf8' }
    );

    // Also save to file
    const resultsPath = path.join(__dirname, 'mcp-persistence-test-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    this.log(`\n📁 Results saved to: ${resultsPath}`, 'blue');
  }

}
