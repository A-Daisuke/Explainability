function __method_wrapper__() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const timeout = (flags.timeout || 30) * 1000;
    
    // Build the full prompt with context
    let fullPrompt = prompt;
    if (previousContent) {
      fullPrompt = `Previous step output:\n${previousContent}\n\nNext step: ${prompt}`;
    }
    
    // Build command args
    const args = ['-p'];
    
    // Always use stream-json output for parsing
    args.push('--output-format', 'stream-json', '--verbose');
    
    // Add the prompt
    args.push(fullPrompt);
    
    if (flags.verbose) {
      console.log(`   Command: claude ${args[0]} ${args[1]} ${args[2]} "${args[4].slice(0, 50)}..."`);
    }
    
    // Spawn Claude process
    const claudeProcess = spawn('claude', args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env
    });
    
    let output = '';
    let stderr = '';
    let completed = false;
    
    // Close stdin since we're not piping input
    claudeProcess.stdin.end();
    
    // Capture output
    claudeProcess.stdout.on('data', (chunk) => {
      output += chunk.toString();
    });
    
    // Capture errors
    claudeProcess.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    
    // Handle completion
    claudeProcess.on('close', (code) => {
      if (completed) return;
      completed = true;
      
      const duration = Date.now() - startTime;
      
      if (code !== 0) {
        console.error(`   Process exited with code ${code}`);
        if (stderr && flags.verbose) {
          console.error(`   stderr: ${stderr.slice(0, 200)}`);
        }
        resolve({
          success: false,
          duration,
          content: null,
          rawOutput: output
        });
        return;
      }
      
      // Extract content from stream-json output
      const content = extractContentFromStream(output);
      
      resolve({
        success: true,
        duration,
        content,
        rawOutput: output
      });
    });
    
    // Handle errors
    claudeProcess.on('error', (error) => {
      if (completed) return;
      completed = true;
      
      console.error('   Process error:', error.message);
      resolve({
        success: false,
        duration: Date.now() - startTime,
        content: null,
        rawOutput: null
      });
    });
    
    // Timeout
    setTimeout(() => {
      if (!completed) {
        completed = true;
        claudeProcess.kill('SIGTERM');
        console.log('   ⏱️  Step timed out');
        resolve({
          success: false,
          duration: timeout,
          content: null,
          rawOutput: null
        });
      }
    }, timeout);
  });

}
