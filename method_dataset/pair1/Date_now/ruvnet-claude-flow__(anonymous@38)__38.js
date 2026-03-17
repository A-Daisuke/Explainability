function __method_wrapper__() {
  return new Promise((resolve) => {
    const args = ['-p'];
    
    if (useStreamJson) {
      args.push('--output-format', 'stream-json', '--verbose');
    }
    
    args.push(prompt);
    const command = `claude ${args.join(' ')}`;
    
    console.log(`🔄 Executing: ${command}`);
    
    const startTime = Date.now();
    
    exec(command, { 
      timeout,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    }, (error, stdout, stderr) => {
      const duration = Date.now() - startTime;
      
      if (error && error.code === 'TIMEOUT') {
        console.log('⚠️  Claude CLI timed out, using mock response...');
        resolve(mockResponse(prompt));
        return;
      }
      
      if (error) {
        console.error('Claude CLI error:', error.message);
        resolve(mockResponse(prompt));
        return;
      }
      
      resolve({
        success: true,
        duration,
        output: stdout.trim(),
        stream: useStreamJson ? stdout : null,
        error: stderr ? stderr.trim() : null
      });
    });
  });

}
