class __C__ {
  generateReport() {
    const totalTime = Date.now() - this.startTime;
    const results = Array.from(this.results.values());
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const total = results.length;
    
    console.log('\n' + '='.repeat(80));
    console.log(chalk.bold.blue('📊 CLAUDE FLOW v2.0.0 TEST REPORT'));
    console.log('='.repeat(80));
    
    console.log(`\n📈 Summary:`);
    console.log(`   Total Tests: ${total}`);
    console.log(`   Passed: ${chalk.green(passed)}`);
    console.log(`   Failed: ${chalk.red(failed)}`);
    console.log(`   Success Rate: ${chalk.cyan(((passed / total) * 100).toFixed(1))}%`);
    console.log(`   Total Time: ${chalk.yellow((totalTime / 1000).toFixed(2))}s`);
    
    if (failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      results.filter(r => !r.success).forEach(result => {
        console.log(`   • ${chalk.red(result.name)}: ${result.error || `Exit code ${result.exitCode}`}`);
      });
    }
    
    console.log(`\n✅ Passed Tests:`);
    results.filter(r => r.success).forEach(result => {
      console.log(`   • ${chalk.green(result.name)}: ${(result.duration / 1000).toFixed(2)}s`);
    });
    
    // Performance summary
    const performanceResults = results.filter(r => r.name.includes('Performance'));
    if (performanceResults.length > 0) {
      console.log(`\n⚡ Performance Summary:`);
      performanceResults.forEach(result => {
        if (result.success) {
          console.log(`   • ${result.name}: ${chalk.green('PASSED')} (${(result.duration / 1000).toFixed(2)}s)`);
        } else {
          console.log(`   • ${result.name}: ${chalk.red('FAILED')}`);
        }
      });
    }
    
    console.log('\n' + '='.repeat(80));
    
    return {
      total,
      passed,
      failed,
      successRate: (passed / total) * 100,
      totalTime,
      results
    };
  }

}
