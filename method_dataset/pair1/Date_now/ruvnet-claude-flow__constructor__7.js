function __method_wrapper__() {
  constructor(agents = [], options = {}) {
    this.agents = new Map();
    this.options = {
      maxWidth: Math.min(process.stdout.columns || 80, 80), // Cap at 80 chars for better compatibility
      updateInterval: 100,
      showTools: true,
      showTimers: true,
      ...options
    };
    
    // Initialize agent states
    agents.forEach(agent => {
      this.agents.set(agent.id, {
        ...agent,
        status: 'pending',
        currentTool: null,
        lastActivity: '',
        startTime: null,
        events: 0,
        progress: 0
      });
    });
    
    this.displayBuffer = [];
    this.lastRender = Date.now();
    this.spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.spinnerIndex = 0;
  }

}
