function __method_wrapper__() {
    claudeProcess.on('close', (code) => {
      if (processCompleted) return;
      processCompleted = true;
      
      const duration = Date.now() - startTime;
      
      if (flags.verbose) {
        console.log(''); // New line after progress dots
      }
      
      if (code !== 0) {
        console.error(`   Process exited with code ${code}`);
        if (stderr) {
          console.error(`   stderr: ${stderr.slice(0, 200)}`);
        }
        
        resolve({
          success: false,
          duration,
          output: null,
          error: stderr || `Process exited with code ${code}`
        });
        return;
      }
      
      resolve({
        success: true,
        duration,
        output: output.trim(),
        error: null
      });
    });

}
