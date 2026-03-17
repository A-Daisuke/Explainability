class __C__ {
  async initializeClaudeAgents(agents) {
    if (!agents || agents.length === 0) {
      return;
    }
    
    // Check if Claude CLI is available
    if (!await this.isClaudeAvailable()) {
      throw new Error('Claude CLI not found. Please install Claude Code: https://claude.ai/code');
    }

    if (this.options.nonInteractive) {
      // Non-interactive mode: agents are spawned per task instead
      if (this.options.logLevel !== 'quiet') {
        console.log(`🤖 Non-interactive mode: Claude instances will be spawned per task`);
        console.log(`📋 Each task will launch its own Claude process with specific prompts`);
      }
      return;
    } else {
      // Interactive mode: spawn single Claude instance with master coordination prompt
      console.log(`🤖 Interactive mode: Initializing single Claude instance for workflow coordination...`);
      
      try {
        // Create master coordination prompt for all agents and workflow
        const masterPrompt = this.createMasterCoordinationPrompt(agents);
        
        // Spawn single Claude instance for workflow coordination
        const claudeProcess = await this.spawnClaudeInstance({
          id: 'master-coordinator',
          name: 'Workflow Coordinator',
          type: 'coordinator'
        }, masterPrompt);
        
        // Store as master coordinator
        this.claudeInstances.set('master-coordinator', {
          process: claudeProcess,
          agent: { id: 'master-coordinator', name: 'Workflow Coordinator', type: 'coordinator' },
          status: 'active',
          startTime: Date.now(),
          agents: agents // Store agent definitions for reference
        });
        
        console.log(`  ✅ Master Workflow Coordinator (PID: ${claudeProcess.pid})`);
        console.log(`  🎯 Coordinating ${agents.length} sub-agents via concurrent streams`);
        console.log(`  📋 Agents: ${agents.map(a => a.name).join(', ')}`);
        
      } catch (error) {
        console.error(`  ❌ Failed to initialize master coordinator: ${error.message}`);
        this.errors.push({
          type: 'master_coordinator_initialization',
          error: error.message,
          timestamp: new Date()
        });
      }
      
      console.log();
    }
  }

}
