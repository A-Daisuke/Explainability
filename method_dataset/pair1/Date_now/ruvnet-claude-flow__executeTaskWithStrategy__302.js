function __method_wrapper__() {
  async executeTaskWithStrategy(task, strategy) {
    const startTime = Date.now();
    const checks = {};
    
    // Save original code
    const originalCode = await fs.readFile(path.join(task.projectDir, 'index.js'), 'utf8');
    
    // Modify code based on strategy (but more carefully!)
    if (strategy === 'aggressive') {
      // Aggressive: Skip some validation (but keep valid syntax)
      const aggressiveCode = originalCode.replace(
        /if \(!(\w+)\)/g, 
        'if (false && !$1)'
      );
      await fs.writeFile(path.join(task.projectDir, 'index.js'), aggressiveCode);
    } else if (strategy === 'conservative') {
      // Conservative: Add validation at the top of functions
      const conservativeCode = originalCode.replace(
        /function (\w+)\((.*?)\) {/g,
        'function $1($2) {\n  // Extra validation for conservative strategy\n  if (arguments.length === 0) throw new Error("No arguments provided");'
      );
      await fs.writeFile(path.join(task.projectDir, 'index.js'), conservativeCode);
    }
    // Balanced: Keep original code

    // Run REAL tests
    try {
      const testResult = execSync('npm test', { 
        cwd: task.projectDir,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      checks.test = { 
        passed: true, 
        score: 1.0,
        output: testResult.slice(0, 100)
      };
    } catch (e) {
      checks.test = { 
        passed: false, 
        score: 0.3,
        error: e.message.slice(0, 100)
      };
    }

    // Run REAL lint
    try {
      const lintResult = execSync('npm run lint', { 
        cwd: task.projectDir,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      const hasErrors = lintResult.includes('error');
      checks.lint = { 
        passed: !hasErrors, 
        score: hasErrors ? 0.5 : 1.0
      };
    } catch (e) {
      checks.lint = { 
        passed: false, 
        score: 0.3
      };
    }

    // Restore original code after testing
    await fs.writeFile(path.join(task.projectDir, 'index.js'), originalCode);
    
    // Calculate REAL performance metrics
    const executionTime = Date.now() - startTime;
    const successRate = Object.values(checks).filter(c => c.passed).length / Object.values(checks).length;
    
    // Strategy-specific scoring based on REAL results
    let strategyBonus = 0;
    if (strategy === 'aggressive' && executionTime < 1000) {
      strategyBonus = 0.2; // Bonus for fast execution
    } else if (strategy === 'conservative' && successRate === 1.0) {
      strategyBonus = 0.3; // Bonus for perfect reliability
    } else if (strategy === 'balanced' && successRate > 0.5 && executionTime < 2000) {
      strategyBonus = 0.25; // Bonus for good balance
    }
    
    const score = (successRate * 60) + (Math.max(0, 1 - executionTime/5000) * 20) + (strategyBonus * 20);
    
    return {
      executionTime,
      successRate,
      checks,
      strategy,
      score,
      real: true // Mark as real execution
    };
  }

}
