function __method_wrapper__() {
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

}
