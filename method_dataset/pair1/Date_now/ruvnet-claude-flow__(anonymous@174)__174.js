function __method_wrapper__() {
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

}
