class __C__ {
  async runVerification() {
    // Prevent concurrent verifications
    if (this.isVerifying) {
      console.log('⏳ Verification already in progress...');
      return null;
    }

    // Check cooldown for automatic verifications
    const now = Date.now();
    if (this.autoVerify && (now - this.lastVerificationTime) < this.verificationCooldown) {
      const remaining = Math.ceil((this.verificationCooldown - (now - this.lastVerificationTime)) / 1000);
      console.log(`⏱️ Verification cooldown: ${remaining}s remaining`);
      return null;
    }

    this.isVerifying = true;
    this.lastVerificationTime = now;

    console.log('\n🔍 Running verification check...');
    
    const checks = [
      { 
        name: 'Type Check', 
        command: 'npm run typecheck 2>&1 || true',
        weight: 0.4 // Higher weight for type checking
      },
      { 
        name: 'Linting', 
        command: 'npm run lint 2>&1 || true',
        weight: 0.3
      },
      { 
        name: 'Build', 
        command: 'npm run build 2>&1 || true',
        weight: 0.3
      }
    ];
    
    let totalScore = 0;
    let totalWeight = 0;
    const results = [];
    
    for (const check of checks) {
      try {
        const { stdout, stderr } = await execAsync(check.command);
        const output = stdout + stderr;
        
        // More intelligent scoring based on actual output
        let score = 1.0;
        
        if (output.toLowerCase().includes('error')) {
          const errorCount = (output.match(/error/gi) || []).length;
          score = Math.max(0.2, 1.0 - (errorCount * 0.1)); // Deduct 0.1 per error, minimum 0.2
        } else if (output.toLowerCase().includes('warning')) {
          const warningCount = (output.match(/warning/gi) || []).length;
          score = Math.max(0.7, 1.0 - (warningCount * 0.05)); // Deduct 0.05 per warning, minimum 0.7
        }
        
        totalScore += score * check.weight;
        totalWeight += check.weight;
        
        const icon = score >= 0.8 ? '✅' : score >= 0.5 ? '⚠️' : '❌';
        console.log(`  ${icon} ${check.name}: ${score.toFixed(2)}`);
        
        results.push({ name: check.name, score, output: output.slice(0, 200) });
      } catch (error) {
        console.log(`  ❌ ${check.name}: 0.00 (failed to run)`);
        results.push({ name: check.name, score: 0, error: error.message });
        totalWeight += check.weight;
      }
    }
    
    const averageScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    this.verificationScores.push({ score: averageScore, timestamp: now, results });
    
    console.log(`\n📊 Verification Score: ${averageScore.toFixed(2)}/${this.threshold}`);
    
    if (averageScore < this.threshold) {
      console.log('⚠️ Verification threshold not met');
      
      // Only show detailed help if score is very low
      if (averageScore < 0.5) {
        console.log('\n💡 Suggestions:');
        console.log('  • Run /test to check test failures');
        console.log('  • Check TypeScript errors with npm run typecheck');
        console.log('  • Fix linting issues with npm run lint --fix');
      }
    } else {
      console.log('✅ Verification passed!');
    }
    
    this.isVerifying = false;
    return averageScore;
  }

}
