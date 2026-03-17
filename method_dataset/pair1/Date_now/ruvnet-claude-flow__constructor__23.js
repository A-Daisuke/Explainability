class __C__ {
  constructor(options = {}) {
    this.options = {
      enableClaude: false,
      nonInteractive: false,
      outputFormat: 'text',
      maxConcurrency: 3,
      timeout: 3600000, // 1 hour default
      logLevel: 'info',
      ...options
    };
    
    // Increase timeout for ML workflows
    if (options.workflowType === 'ml' || options.workflowName?.toLowerCase().includes('mle')) {
      this.options.timeout = 7200000; // 2 hours for ML workflows
    }
    
    // Execution state
    this.executionId = generateId('workflow-exec');
    this.startTime = Date.now();
    this.activeTasks = new Map();
    this.claudeInstances = new Map();
    this.results = new Map();
    this.errors = [];
    this.currentWorkflow = null;
    
    // Stream chaining support
    this.taskOutputStreams = new Map(); // Store output streams for chaining
    this.enableChaining = options.enableChaining !== false; // Default to true
    
    // Hooks integration
    this.hooksEnabled = true;
    this.sessionId = generateId('automation-session');
  }

}
