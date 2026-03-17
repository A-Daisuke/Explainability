async function bottleneckDetectCommand(subArgs, flags) {
  const options = flags;
  const scope = options.scope || 'system';
  const target = options.target || 'all';

  console.log(`🔍 Detecting performance bottlenecks...`);
  console.log(`📊 Scope: ${scope}`);
  console.log(`🎯 Target: ${target}`);

  try {
    // Initialize metrics system without starting monitoring
    await initializeMetrics(false);
    
    // Get real bottleneck analysis
    const analysis = await getBottleneckAnalysis(scope, target);
    
    printSuccess(`✅ Bottleneck analysis completed`);

    console.log(`\n📊 BOTTLENECK ANALYSIS RESULTS:`);
    
    analysis.bottlenecks.forEach((bottleneck) => {
      const icon =
        bottleneck.severity === 'critical'
          ? '🔴'
          : bottleneck.severity === 'warning'
            ? '🟡'
            : '🟢';
      console.log(
        `  ${icon} ${bottleneck.severity.toUpperCase()}: ${bottleneck.component} (${bottleneck.metric})`,
      );
      
      // Show details if available
      if (bottleneck.details) {
        bottleneck.details.forEach(detail => {
          console.log(`      - ${detail.type || detail.id}: ${detail.duration}s`);
        });
      }
    });

    if (analysis.recommendations.length > 0) {
      console.log(`\n💡 RECOMMENDATIONS:`);
      analysis.recommendations.forEach((rec) => {
        console.log(`  • ${rec}`);
      });
    }

    console.log(`\n📊 PERFORMANCE METRICS:`);
    console.log(`  • Analysis duration: ${analysis.analysisDuration.toFixed(2)}ms`);
    console.log(`  • Confidence score: ${(analysis.confidenceScore * 100).toFixed(0)}%`);
    console.log(`  • Issues detected: ${analysis.issuesDetected}`);

    // Save detailed report
    const reportPath = path.join(process.cwd(), 'analysis-reports', `bottleneck-${Date.now()}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(analysis, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
  } catch (err) {
    printError(`Bottleneck analysis failed: ${err.message}`);
    console.log('\nFalling back to simulated analysis...');
    
    // Fallback to simulated data
    console.log(`\n📊 BOTTLENECK ANALYSIS RESULTS (SIMULATED):`);
    console.log(`  🔴 CRITICAL: Memory usage in agent spawn process (85% utilization)`);
    console.log(`  🟡 WARNING: Task queue processing (12s avg)`);
    console.log(`  🟢 GOOD: Neural training pipeline (optimal)`);
    console.log(`  🟢 GOOD: Swarm coordination latency (within limits)`);
  }
}
