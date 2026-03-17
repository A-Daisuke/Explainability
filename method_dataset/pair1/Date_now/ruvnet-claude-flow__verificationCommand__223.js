export async function verificationCommand(args, flags) {
  const system = new VerificationSystem();
  const subcommand = args[0] || 'status';
  
  // Handle help flag
  if (flags.help || subcommand === '--help' || subcommand === 'help') {
    const { COMMAND_HELP } = await import('../help-text.js');
    console.log(COMMAND_HELP.verify);
    return;
  }

  switch (subcommand) {
    case 'init':
      const mode = args[1] || flags.mode || 'moderate';
      await system.initialize(mode);
      break;

    case 'verify':
      const taskId = args[1] || flags.taskId || `task-${Date.now()}`;
      const agentType = flags.agent || 'coder';
      const claims = { success: flags.success !== false };
      await system.verifyTask(taskId, agentType, claims);
      break;

    case 'truth':
    case 'score':
      await system.loadMemory();
      
      // Filter by agent if specified
      let filteredHistory = system.verificationHistory;
      if (flags.agent) {
        filteredHistory = system.verificationHistory.filter(v => v.agentType === flags.agent);
        if (filteredHistory.length === 0) {
          console.log(`\n⚠️ No verification history found for agent: ${flags.agent}`);
          return;
        }
      }
      
      // Filter by taskId if specified
      if (flags.taskId) {
        filteredHistory = filteredHistory.filter(v => v.taskId === flags.taskId);
        if (filteredHistory.length === 0) {
          console.log(`\n⚠️ No verification history found for task: ${flags.taskId}`);
          return;
        }
      }
      
      // Filter by threshold if specified
      if (flags.threshold) {
        const threshold = parseFloat(flags.threshold);
        filteredHistory = filteredHistory.filter(v => v.score < threshold);
        if (filteredHistory.length === 0) {
          console.log(`\n✅ All verifications meet or exceed threshold: ${threshold}`);
          return;
        }
      }
      
      // Generate report (with filtered data if agent specified)
      const report = flags.agent ? 
        await generateFilteredReport(system, filteredHistory, flags.agent) :
        await system.generateTruthReport();
      
      // JSON output only mode
      if (flags.json) {
        console.log(JSON.stringify(report, null, 2));
        return;
      }
      
      // Basic report (shown when not in JSON mode)
      console.log('\n📊 Truth Scoring Report' + (flags.agent ? ` - Agent: ${flags.agent}` : ''));
      console.log('━'.repeat(50));
      console.log(`Mode: ${report.mode || system.mode}`);
      console.log(`Threshold: ${report.threshold || VERIFICATION_MODES[system.mode].threshold}`);
      console.log(`Total Verifications: ${report.totalVerifications}`);
      console.log(`Passed: ${report.passedVerifications}`);
      console.log(`Average Score: ${report.averageScore.toFixed(3)}`);
      
      if (flags.agent) {
        // Show detailed info for specific agent
        console.log(`\n🤖 ${flags.agent} Agent Details:`);
        console.log(`   Reliability: ${(report.agentReliability[flags.agent] * 100).toFixed(1)}%`);
        console.log(`   Total Tasks: ${filteredHistory.length}`);
        console.log(`   Passed: ${filteredHistory.filter(v => v.passed).length}`);
        console.log(`   Failed: ${filteredHistory.filter(v => !v.passed).length}`);
        
        if (flags.detailed || flags.detail) {
          console.log('\n📋 Verification History:');
          const recentAgent = filteredHistory.slice(-10);
          for (const v of recentAgent) {
            const time = new Date(v.timestamp).toLocaleTimeString();
            console.log(`   ${v.passed ? '✅' : '❌'} [${time}] ${v.taskId}: ${v.score.toFixed(3)}`);
            if (v.results && flags.verbose) {
              for (const [check, result] of Object.entries(v.results)) {
                console.log(`      • ${check}: ${result.passed ? '✓' : '✗'} (${result.score.toFixed(2)})`);
              }
            }
          }
          
          // Score distribution
          const scores = filteredHistory.map(v => v.score);
          const minScore = Math.min(...scores);
          const maxScore = Math.max(...scores);
          console.log('\n📊 Score Distribution:');
          console.log(`   Min Score: ${minScore.toFixed(3)}`);
          console.log(`   Max Score: ${maxScore.toFixed(3)}`);
          console.log(`   Average: ${report.averageScore.toFixed(3)}`);
          
          // Performance trend
          if (filteredHistory.length > 5) {
            const recent5 = filteredHistory.slice(-5);
            const older5 = filteredHistory.slice(-10, -5);
            const recentAvg = recent5.reduce((sum, v) => sum + v.score, 0) / recent5.length;
            const olderAvg = older5.length > 0 ? 
              older5.reduce((sum, v) => sum + v.score, 0) / older5.length : 0;
            
            console.log('\n📈 Performance Trend:');
            if (olderAvg > 0) {
              const trend = recentAvg - olderAvg;
              const trendSymbol = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
              console.log(`   Recent Average: ${recentAvg.toFixed(3)} ${trendSymbol}`);
              console.log(`   Previous Average: ${olderAvg.toFixed(3)}`);
              console.log(`   Change: ${trend >= 0 ? '+' : ''}${(trend * 100).toFixed(1)}%`);
            } else {
              console.log(`   Recent Average: ${recentAvg.toFixed(3)}`);
            }
          }
        }
      } else {
        console.log('\n🤖 Agent Reliability:');
        for (const [agent, reliability] of Object.entries(report.agentReliability)) {
          console.log(`   ${agent}: ${(reliability * 100).toFixed(1)}%`);
        }
      }
      
      // Detailed report with --report flag
      if (flags.report) {
        console.log('\n📈 Detailed Verification Breakdown:');
        console.log(`   Pass Rate: ${((report.passedVerifications / report.totalVerifications) * 100).toFixed(1)}%`);
        console.log(`   Failure Rate: ${(((report.totalVerifications - report.passedVerifications) / report.totalVerifications) * 100).toFixed(1)}%`);
        
        // Show recent history
        if (system.verificationHistory.length > 0) {
          console.log('\n📜 Last 10 Verifications:');
          const recent = system.verificationHistory.slice(-10);
          for (const v of recent) {
            const time = new Date(v.timestamp).toLocaleTimeString();
            console.log(`   ${v.passed ? '✅' : '❌'} [${time}] ${v.taskId} (${v.agentType}): ${v.score.toFixed(3)}`);
          }
        }
        
        // Performance metrics
        console.log('\n🎯 Target Metrics Comparison:');
        console.log(`   Truth Accuracy: ${report.averageScore >= 0.95 ? '✅' : '❌'} ${(report.averageScore * 100).toFixed(1)}% (target: 95%)`);
        console.log(`   Pass Rate: ${report.passedVerifications/report.totalVerifications >= 0.9 ? '✅' : '❌'} ${((report.passedVerifications/report.totalVerifications) * 100).toFixed(1)}% (target: 90%)`);
      }
      
      // Failure analysis with --analyze flag
      if (flags.analyze) {
        console.log('\n🔍 Failure Pattern Analysis:');
        
        // Analyze failures by agent
        const failures = system.verificationHistory.filter(v => !v.passed);
        if (failures.length > 0) {
          const failuresByAgent = {};
          for (const f of failures) {
            failuresByAgent[f.agentType] = (failuresByAgent[f.agentType] || 0) + 1;
          }
          
          console.log('   Failures by Agent:');
          for (const [agent, count] of Object.entries(failuresByAgent)) {
            const percentage = (count / failures.length * 100).toFixed(1);
            console.log(`   • ${agent}: ${count} failures (${percentage}%)`);
          }
          
          // Common failure scores
          const failureScores = failures.map(f => f.score);
          const avgFailureScore = failureScores.reduce((a, b) => a + b, 0) / failureScores.length;
          console.log(`\n   Average Failure Score: ${avgFailureScore.toFixed(3)}`);
          console.log(`   Score Gap to Threshold: ${(report.threshold - avgFailureScore).toFixed(3)}`);
          
          // Recommendations
          console.log('\n💡 Recommendations:');
          if (avgFailureScore < 0.5) {
            console.log('   • Critical: Major quality issues detected');
            console.log('   • Consider switching to development mode for debugging');
            console.log('   • Review agent configurations and requirements');
          } else if (avgFailureScore < report.threshold) {
            console.log('   • Moderate: Close to threshold but needs improvement');
            console.log('   • Focus on failing agents: ' + Object.keys(failuresByAgent).join(', '));
            console.log('   • Consider adjusting verification requirements');
          }
        } else {
          console.log('   ✅ No failures detected!');
        }
      }
      
      // Export to file with --export flag
      if (flags.export) {
        const exportPath = typeof flags.export === 'string' ? flags.export : `truth-report-${Date.now()}.json`;
        const exportData = {
          report,
          filteredHistory,
          metadata: {
            exported: new Date().toISOString(),
            filters: {
              agent: flags.agent || null,
              taskId: flags.taskId || null,
              threshold: flags.threshold || null
            },
            command: 'truth',
            version: '2.0.0-alpha.89'
          }
        };
        
        try {
          await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2));
          console.log(`\n📁 Report exported to: ${exportPath}`);
        } catch (error) {
          console.error(`\n❌ Failed to export report: ${error.message}`);
        }
      }
      break;

    case 'status':
    default:
      await system.loadMemory();
      console.log('\n🔍 Verification System Status');
      console.log('━'.repeat(50));
      console.log(`Mode: ${system.mode}`);
      console.log(`Verifications: ${system.verificationHistory.length}`);
      console.log(`Recent: ${system.verificationHistory.slice(-5).length} verifications`);
      
      if (system.verificationHistory.length > 0) {
        const recent = system.verificationHistory.slice(-5);
        console.log('\n📜 Recent Verifications:');
        for (const v of recent) {
          console.log(`   ${v.passed ? '✅' : '❌'} ${v.taskId} (${v.agentType}): ${v.score.toFixed(2)}`);
        }
      }
      
      console.log('\n💡 Commands:');
      console.log('   verify init [mode]     - Initialize system');
      console.log('   verify verify [taskId] - Verify a task');
      console.log('   verify truth          - Show truth scores');
      console.log('   verify status         - Show system status');
      break;
  }
}
