function __method_wrapper__() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const timeout = (flags.timeout || 30) * 1000;
    
    // Build args based on position in chain
    const args = ['-p'];
    
    // First step: only output stream-json
    // Middle steps: both input and output stream-json
    // Last step: only input stream-json (if not first)
    
    if (!isFirst && inputStream) {
      args.push('--input-format', 'stream-json');
    }
    
    if (!isLast) {
      args.push('--output-format', 'stream-json');
      if (flags.verbose) {
        args.push('--verbose');
      }
    }
    
    args.push(prompt);
    
    console.log(`   Executing: claude ${args.join(' ')}`);
    
    // Spawn the Claude process
    const claudeProcess = spawn('claude', args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env
    });
    
    let output = '';
    let stderr = '';
    let processCompleted = false;
    
    // If we have input from previous step, pipe it
    if (!isFirst && inputStream) {
      console.log('   🔗 Piping input from previous step...');
      
      // Create a readable stream from the input string
      const inputReadable = Readable.from(inputStream);
      inputReadable.pipe(claudeProcess.stdin);
      
      // Handle pipe errors
      inputReadable.on('error', (error) => {
        console.error('   Input pipe error:', error.message);
      });
    } else {
      // Close stdin if no input
      claudeProcess.stdin.end();
    }
    
    // Capture output
    claudeProcess.stdout.on('data', (data) => {
      output += data.toString();
      
      // Show progress dots in verbose mode
      if (flags.verbose && !processCompleted) {
        process.stdout.write('.');
      }
    });
    
    // Capture errors
    claudeProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Handle process completion
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
    
    // Handle process errors
    claudeProcess.on('error', (error) => {
      if (processCompleted) return;
      processCompleted = true;
      
      console.error('   Process error:', error.message);
      reject(error);
    });
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      if (processCompleted) return;
      processCompleted = true;
      
      console.log('   ⏱️  Timeout reached, terminating...');
      claudeProcess.kill('SIGTERM');
      
      resolve({
        success: false,
        duration: timeout,
        output: null,
        error: 'Process timed out'
      });
    }, timeout);
    
    // Clear timeout when process completes
    claudeProcess.on('exit', () => {
      clearTimeout(timeoutId);
    });
  });

}
