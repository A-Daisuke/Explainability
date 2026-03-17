class __C__ {
  async runTest(test) {
    this.log(`Starting: ${test.name} - ${test.description}`);
    
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const child = spawn(test.command, test.args, {
        cwd: projectRoot,
        stdio: this.verbose ? 'inherit' : 'pipe',
        shell: process.platform === 'win32'
      });

      let stdout = '';
      let stderr = '';
      
      if (!this.verbose) {
        child.stdout?.on('data', (data) => {
          stdout += data.toString();
        });
        
        child.stderr?.on('data', (data) => {
          stderr += data.toString();
        });
      }

      // Set timeout
      const timeoutId = setTimeout(() => {
        child.kill('SIGTERM');
        const result = {
          name: test.name,
          success: false,
          error: 'Test timed out',
          duration: Date.now() - startTime,
          stdout: stdout,
          stderr: stderr
        };
        this.results.set(test.name, result);
        resolve(result);
      }, test.timeout);

      child.on('close', (code) => {
        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;
        
        const result = {
          name: test.name,
          success: code === 0,
          exitCode: code,
          duration: duration,
          stdout: stdout,
          stderr: stderr
        };
        
        if (code === 0) {
          this.log(`Completed: ${test.name} (${duration}ms)`, 'success');
        } else {
          this.log(`Failed: ${test.name} (exit code: ${code})`, 'error');
          if (!this.verbose && stderr) {
            console.log(chalk.red('Error output:'));
            console.log(stderr);
          }
        }
        
        this.results.set(test.name, result);
        resolve(result);
      });

      child.on('error', (error) => {
        clearTimeout(timeoutId);
        const result = {
          name: test.name,
          success: false,
          error: error.message,
          duration: Date.now() - startTime,
          stdout: stdout,
          stderr: stderr
        };
        
        this.log(`Error: ${test.name} - ${error.message}`, 'error');
        this.results.set(test.name, result);
        resolve(result);
      });
    });
  }

}
