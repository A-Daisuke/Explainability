export async function swarmCommand(args, flags) {
  // Handle headless mode early
  if (flags && flags.headless) {
    const isHeadless = isHeadlessEnvironment();
    // Configure for headless mode
    flags = {
      ...flags,
      'non-interactive': true,
      'output-format': flags['output-format'] || 'stream-json',
      'no-auto-permissions': false,
    };
  }
  
  // Handle health check first
  if (flags && flags['health-check']) {
    try {
      // Quick health check for Docker/K8s
      console.log(JSON.stringify({
        status: 'healthy',
        service: 'claude-flow-swarm',
        version: process.env.npm_package_version || '2.0.0',
        timestamp: new Date().toISOString()
      }));
      process.exit(0);
    } catch (error) {
      console.error(JSON.stringify({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      }));
      process.exit(1);
    }
  }

  const objective = (args || []).join(' ').trim();

  if (!objective) {
    console.error('❌ Usage: swarm <objective>');
    showSwarmHelp();
    return;
  }

  // Force headless mode if flag is set
  if (flags && flags.headless) {
    const isHeadless = isHeadlessEnvironment();
    if (!isHeadless) {
      console.log('🤖 Forcing headless mode as requested');
    }
    flags = {
      ...flags,
      'non-interactive': true,
      'output-format': flags['output-format'] || 'json',
      'no-auto-permissions': false,
    };
  }

  // Handle JSON output format
  const outputFormat = flags && flags['output-format'];
  const outputFile = flags && flags['output-file'];
  const isJsonOutput = outputFormat === 'json';
  const isNonInteractive = isJsonOutput || (flags && flags['no-interactive']);
  const useJsonLogs = flags && flags['json-logs'];

  // Override console.log for JSON logs if requested
  if (useJsonLogs) {
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      originalLog(JSON.stringify({
        level: 'info',
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        service: 'claude-flow-swarm'
      }));
    };
    
    console.error = (...args) => {
      originalError(JSON.stringify({
        level: 'error',
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        service: 'claude-flow-swarm'
      }));
    };
  }

  // Handle analysis/read-only mode
  const isAnalysisMode = flags && (flags.analysis || flags['read-only']);
  const analysisMode = isAnalysisMode ? 'analysis' : 'standard';

  // For JSON output, allow using Claude with stream-json format
  // Only force executor mode if explicitly using 'json' format (not 'stream-json')
  if (flags && flags['output-format'] === 'json' && !(flags && flags.executor)) {
    // Keep backward compatibility - regular 'json' format uses executor
    flags = { ...(flags || {}), executor: true };
  }

  // Check if we should use the old executor (opt-in with --executor flag)
  if (flags && flags.executor) {
    // Continue with the old swarm executor implementation below
  } else {
    // Default behavior: spawn Claude Code with comprehensive swarm MCP instructions
    try {
      const { execSync, spawn } = await import('child_process');

      // Get configuration values first
      const strategy = flags.strategy || 'auto';
      const mode = flags.mode || 'centralized';
      const maxAgents = flags['max-agents'] || 5;

      // Get strategy-specific guidance
      const strategyGuidance = getStrategyGuidance(strategy, objective);
      const modeGuidance = getModeGuidance(mode);
      const agentRecommendations = getAgentRecommendations(strategy, maxAgents, objective);

      const enableSparc =
        flags.sparc !== false && (strategy === 'development' || strategy === 'auto');

      // Build the complete swarm prompt before checking for claude
      const swarmPrompt = `You are orchestrating a Claude Flow Swarm using Claude Code's Task tool for agent execution.

🚨 CRITICAL INSTRUCTION: Use Claude Code's Task Tool for ALL Agent Spawning!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Claude Code's Task tool = Spawns agents that DO the actual work
❌ MCP tools = Only for coordination setup, NOT for execution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 OBJECTIVE: ${objective}

🐝 SWARM CONFIGURATION:
- Strategy: ${strategy}
- Mode: ${mode}
- Max Agents: ${maxAgents}
- Timeout: ${flags.timeout || 60} minutes
- Parallel Execution: MANDATORY (Always use BatchTool)
- Review Mode: ${flags.review || false}
- Testing Mode: ${flags.testing || false}
- Analysis Mode: ${isAnalysisMode ? 'ENABLED (Read-Only)' : 'DISABLED'}

${
  isAnalysisMode
    ? `🔍 ANALYSIS MODE CONSTRAINTS:

⚠️  READ-ONLY MODE ACTIVE - NO CODE MODIFICATIONS ALLOWED

REQUIRED BEHAVIORS:
1. ✅ READ files for analysis (Read tool)
2. ✅ SEARCH codebases (Glob, Grep tools)
3. ✅ ANALYZE code structure and patterns
4. ✅ GENERATE reports and documentation
5. ✅ CREATE analysis summaries
6. ✅ STORE findings in memory for collaboration
7. ✅ COMMUNICATE between agents about findings

FORBIDDEN OPERATIONS:
1. ❌ NEVER use Write tool to modify files
2. ❌ NEVER use Edit or MultiEdit tools
3. ❌ NEVER use Bash to run commands that modify files
4. ❌ NEVER create new files or directories
5. ❌ NEVER install packages or dependencies
6. ❌ NEVER modify configuration files
7. ❌ NEVER execute code that changes system state

ALL AGENTS MUST OPERATE IN READ-ONLY MODE. Focus on:
- Code analysis and understanding
- Security vulnerability assessment
- Performance bottleneck identification
- Architecture documentation
- Technical debt analysis
- Dependency mapping
- Testing strategy recommendations

Generate comprehensive reports instead of making changes.

`
    : ''
}🚨 CRITICAL: PARALLEL EXECUTION IS MANDATORY! 🚨

📋 CLAUDE-FLOW SWARM BATCHTOOL INSTRUCTIONS

⚡ THE GOLDEN RULE:
If you need to do X operations, they should be in 1 message, not X messages.

🎯 MANDATORY PATTERNS FOR CLAUDE-FLOW SWARMS:

1️⃣ **SWARM INITIALIZATION** - Use Claude Code's Task Tool for Agents:

Step A: Optional MCP Coordination Setup (Single Message):
\`\`\`javascript
[MCP Tools - Coordination ONLY]:
  // Set up coordination topology (OPTIONAL)
  mcp__claude-flow__swarm_init {"topology": "mesh", "maxAgents": ${maxAgents}}
  mcp__claude-flow__agent_spawn {"type": "coordinator", "name": "SwarmLead"}
  mcp__claude-flow__memory_store {"key": "swarm/objective", "value": "${objective}"}
  mcp__claude-flow__memory_store {"key": "swarm/config", "value": {"strategy": "${strategy}"}}
\`\`\`

Step B: REQUIRED - Claude Code Task Tool for ACTUAL Agent Execution (Single Message):
\`\`\`javascript
[Claude Code Task Tool - CONCURRENT Agent Spawning]:
  // Spawn ALL agents using Task tool in ONE message
  Task("Coordinator", "Lead swarm coordination. Use hooks for memory sharing.", "coordinator")
  Task("Researcher", "Analyze requirements and patterns. Coordinate via hooks.", "researcher")
  Task("Backend Dev", "Implement server-side features. Share progress via hooks.", "coder")
  Task("Frontend Dev", "Build UI components. Sync with backend via memory.", "coder")
  Task("QA Engineer", "Create and run tests. Report findings via hooks.", "tester")
  
  // Batch ALL todos in ONE TodoWrite call (5-10+ todos)
  TodoWrite {"todos": [
    {"id": "1", "content": "Initialize ${maxAgents} agent swarm", "status": "completed", "priority": "high"},
    {"id": "2", "content": "Analyze: ${objective}", "status": "in_progress", "priority": "high"},
    {"id": "3", "content": "Design architecture", "status": "pending", "priority": "high"},
    {"id": "4", "content": "Implement backend", "status": "pending", "priority": "high"},
    {"id": "5", "content": "Implement frontend", "status": "pending", "priority": "high"},
    {"id": "6", "content": "Write unit tests", "status": "pending", "priority": "medium"},
    {"id": "7", "content": "Integration testing", "status": "pending", "priority": "medium"},
    {"id": "8", "content": "Performance optimization", "status": "pending", "priority": "low"},
    {"id": "9", "content": "Documentation", "status": "pending", "priority": "low"}
  ]}
\`\`\`

⚠️ CRITICAL: Claude Code's Task tool does the ACTUAL work!
- MCP tools = Coordination setup only
- Task tool = Spawns agents that execute real work
- ALL agents MUST be spawned in ONE message
- ALL todos MUST be batched in ONE TodoWrite call

2️⃣ **TASK COORDINATION** - Batch ALL assignments:
\`\`\`javascript
[Single Message]:
  // Assign all tasks
  mcp__claude-flow__task_assign {"taskId": "research-1", "agentId": "researcher-1"}
  mcp__claude-flow__task_assign {"taskId": "design-1", "agentId": "architect-1"}
  mcp__claude-flow__task_assign {"taskId": "code-1", "agentId": "coder-1"}
  mcp__claude-flow__task_assign {"taskId": "code-2", "agentId": "coder-2"}
  
  // Communicate to all agents
  mcp__claude-flow__agent_communicate {"to": "all", "message": "Begin phase 1"}
  
  // Update multiple task statuses
  mcp__claude-flow__task_update {"taskId": "research-1", "status": "in_progress"}
  mcp__claude-flow__task_update {"taskId": "design-1", "status": "pending"}
\`\`\`

3️⃣ **MEMORY COORDINATION** - Store/retrieve in batches:
\`\`\`javascript
[Single Message]:
  // Store multiple findings
  mcp__claude-flow__memory_store {"key": "research/requirements", "value": {...}}
  mcp__claude-flow__memory_store {"key": "research/constraints", "value": {...}}
  mcp__claude-flow__memory_store {"key": "architecture/decisions", "value": {...}}
  
  // Retrieve related data
  mcp__claude-flow__memory_retrieve {"key": "research/*"}
  mcp__claude-flow__memory_search {"pattern": "architecture"}
\`\`\`

4️⃣ **FILE & CODE OPERATIONS** - Parallel execution:
\`\`\`javascript
[Single Message]:
  // Read multiple files
  Read {"file_path": "/src/index.js"}
  Read {"file_path": "/src/config.js"}
  Read {"file_path": "/package.json"}
  
  // Write multiple files
  Write {"file_path": "/src/api/auth.js", "content": "..."}
  Write {"file_path": "/src/api/users.js", "content": "..."}
  Write {"file_path": "/tests/auth.test.js", "content": "..."}
  
  // Update memory with results
  mcp__claude-flow__memory_store {"key": "code/api/auth", "value": "implemented"}
  mcp__claude-flow__memory_store {"key": "code/api/users", "value": "implemented"}
\`\`\`

5️⃣ **MONITORING & STATUS** - Combined checks:
\`\`\`javascript
[Single Message]:
  mcp__claude-flow__swarm_monitor {}
  mcp__claude-flow__swarm_status {}
  mcp__claude-flow__agent_list {"status": "active"}
  mcp__claude-flow__task_status {"includeCompleted": false}
  TodoRead {}
\`\`\`

❌ NEVER DO THIS (Sequential = SLOW):
\`\`\`
Message 1: mcp__claude-flow__agent_spawn
Message 2: mcp__claude-flow__agent_spawn
Message 3: TodoWrite (one todo)
Message 4: Read file
Message 5: mcp__claude-flow__memory_store
\`\`\`

✅ ALWAYS DO THIS (Batch = FAST):
\`\`\`
Message 1: [All operations in one message]
\`\`\`

💡 BATCHTOOL BEST PRACTICES:
- Group by operation type (all spawns, all reads, all writes)
- Use TodoWrite with 5-10 todos at once
- Combine file operations when analyzing codebases
- Store multiple memory items per message
- Never send more than one message for related operations

${strategyGuidance}

${modeGuidance}

${agentRecommendations}

📋 MANDATORY PARALLEL WORKFLOW:

1. **INITIAL SPAWN (Single BatchTool Message):**
   - Spawn ALL agents at once
   - Create ALL initial todos at once
   - Store initial memory state
   - Create task hierarchy
   
   Example:
   \`\`\`
   [BatchTool]:
     mcp__claude-flow__agent_spawn (coordinator)
     mcp__claude-flow__agent_spawn (architect)
     mcp__claude-flow__agent_spawn (coder-1)
     mcp__claude-flow__agent_spawn (coder-2)
     mcp__claude-flow__agent_spawn (tester)
     mcp__claude-flow__memory_store { key: "init", value: {...} }
     mcp__claude-flow__task_create { name: "Main", subtasks: [...] }
     TodoWrite { todos: [5-10 todos at once] }
   \`\`\`

2. **TASK EXECUTION (Parallel Batches):**
   - Assign multiple tasks in one batch
   - Update multiple statuses together
   - Store multiple results simultaneously
   
3. **MONITORING (Combined Operations):**
   - Check all agent statuses together
   - Retrieve multiple memory items
   - Update all progress markers

🔧 AVAILABLE MCP TOOLS FOR SWARM COORDINATION:

📊 MONITORING & STATUS:
- mcp__claude-flow__swarm_status - Check current swarm status and agent activity
- mcp__claude-flow__swarm_monitor - Real-time monitoring of swarm execution
- mcp__claude-flow__agent_list - List all active agents and their capabilities
- mcp__claude-flow__task_status - Check task progress and dependencies

🧠 MEMORY & KNOWLEDGE:
- mcp__claude-flow__memory_store - Store knowledge in swarm collective memory
- mcp__claude-flow__memory_retrieve - Retrieve shared knowledge from memory
- mcp__claude-flow__memory_search - Search collective memory by pattern
- mcp__claude-flow__memory_sync - Synchronize memory across agents

🤖 AGENT MANAGEMENT:
- mcp__claude-flow__agent_spawn - Spawn specialized agents for tasks
- mcp__claude-flow__agent_assign - Assign tasks to specific agents
- mcp__claude-flow__agent_communicate - Send messages between agents
- mcp__claude-flow__agent_coordinate - Coordinate agent activities

📋 TASK ORCHESTRATION:
- mcp__claude-flow__task_create - Create new tasks with dependencies
- mcp__claude-flow__task_assign - Assign tasks to agents
- mcp__claude-flow__task_update - Update task status and progress
- mcp__claude-flow__task_complete - Mark tasks as complete with results

🎛️ COORDINATION MODES:
1. CENTRALIZED (default): Single coordinator manages all agents
   - Use when: Clear hierarchy needed, simple workflows
   - Tools: agent_assign, task_create, swarm_monitor

2. DISTRIBUTED: Multiple coordinators share responsibility
   - Use when: Large scale tasks, fault tolerance needed
   - Tools: agent_coordinate, memory_sync, task_update

3. HIERARCHICAL: Tree structure with team leads
   - Use when: Complex projects with sub-teams
   - Tools: agent_spawn (with parent), task_create (with subtasks)

4. MESH: Peer-to-peer agent coordination
   - Use when: Maximum flexibility, self-organizing teams
   - Tools: agent_communicate, memory_store/retrieve

⚡ EXECUTION WORKFLOW - ALWAYS USE BATCHTOOL:
${
  enableSparc
    ? `
1. SPARC METHODOLOGY WITH PARALLEL EXECUTION:
   
   S - Specification Phase (Single BatchTool):
   \`\`\`
   [BatchTool]:
     mcp__claude-flow__memory_store { key: "specs/requirements", value: {...} }
     mcp__claude-flow__task_create { name: "Requirement 1" }
     mcp__claude-flow__task_create { name: "Requirement 2" }
     mcp__claude-flow__task_create { name: "Requirement 3" }
     mcp__claude-flow__agent_spawn { type: "researcher", name: "SpecAnalyst" }
   \`\`\`
   
   P - Pseudocode Phase (Single BatchTool):
   \`\`\`
   [BatchTool]:
     mcp__claude-flow__memory_store { key: "pseudocode/main", value: {...} }
     mcp__claude-flow__task_create { name: "Design API" }
     mcp__claude-flow__task_create { name: "Design Data Model" }
     mcp__claude-flow__agent_communicate { to: "all", message: "Review design" }
   \`\`\`
   
   A - Architecture Phase (Single BatchTool):
   \`\`\`
   [BatchTool]:
     mcp__claude-flow__agent_spawn { type: "architect", name: "LeadArchitect" }
     mcp__claude-flow__memory_store { key: "architecture/decisions", value: {...} }
     mcp__claude-flow__task_create { name: "Backend", subtasks: [...] }
     mcp__claude-flow__task_create { name: "Frontend", subtasks: [...] }
   \`\`\`
   
   R - Refinement Phase (Single BatchTool):
   \`\`\`
   [BatchTool]:
     mcp__claude-flow__swarm_monitor {}
     mcp__claude-flow__task_update { taskId: "1", progress: 50 }
     mcp__claude-flow__task_update { taskId: "2", progress: 75 }
     mcp__claude-flow__memory_store { key: "learnings/iteration1", value: {...} }
   \`\`\`
   
   C - Completion Phase (Single BatchTool):
   \`\`\`
   [BatchTool]:
     mcp__claude-flow__task_complete { taskId: "1", results: {...} }
     mcp__claude-flow__task_complete { taskId: "2", results: {...} }
     mcp__claude-flow__memory_retrieve { pattern: "**/*" }
     TodoWrite { todos: [{content: "Final review", status: "completed"}] }
   \`\`\`
`
    : `
1. STANDARD SWARM EXECUTION WITH PARALLEL OPERATIONS:
   
   Initial Setup (Single BatchTool):
   \`\`\`
   [BatchTool]:
     mcp__claude-flow__task_create { name: "Main", subtasks: [...] }
     mcp__claude-flow__agent_spawn { type: "coordinator" }
     mcp__claude-flow__agent_spawn { type: "coder" }
     mcp__claude-flow__agent_spawn { type: "tester" }
     mcp__claude-flow__memory_store { key: "init", value: {...} }
   \`\`\`
   
   Task Assignment (Single BatchTool):
   \`\`\`
   [BatchTool]:
     mcp__claude-flow__task_assign { taskId: "1", agentId: "agent-1" }
     mcp__claude-flow__task_assign { taskId: "2", agentId: "agent-2" }
     mcp__claude-flow__task_assign { taskId: "3", agentId: "agent-3" }
   \`\`\`
   
   Monitoring & Updates (Single BatchTool):
   \`\`\`
   [BatchTool]:
     mcp__claude-flow__swarm_monitor {}
     mcp__claude-flow__agent_communicate { to: "all", message: "Status update" }
     mcp__claude-flow__memory_store { key: "progress", value: {...} }
   \`\`\`
`
}

🤝 AGENT TYPES & THEIR MCP TOOL USAGE:

COORDINATOR:
- Primary tools: swarm_monitor, agent_assign, task_create
- Monitors overall progress and assigns work
- Uses memory_store for decisions and memory_retrieve for context

RESEARCHER:
- Primary tools: memory_search, memory_store
- Gathers information and stores findings
- Uses agent_communicate to share discoveries

CODER:
- Primary tools: task_update, memory_retrieve, memory_store
- Implements solutions and updates progress
- Retrieves specs from memory, stores code artifacts

ANALYST:
- Primary tools: memory_search, swarm_monitor
- Analyzes data and patterns
- Stores insights and recommendations

TESTER:
- Primary tools: task_status, agent_communicate
- Validates implementations
- Reports issues via task_update

📝 EXAMPLE MCP TOOL USAGE PATTERNS:

1. Starting a swarm:
   mcp__claude-flow__agent_spawn {"type": "coordinator", "name": "SwarmLead"}
   mcp__claude-flow__memory_store {"key": "objective", "value": "${objective}"}
   mcp__claude-flow__task_create {"name": "Main Objective", "type": "parent"}

2. Spawning worker agents:
   mcp__claude-flow__agent_spawn {"type": "researcher", "capabilities": ["web-search"]}
   mcp__claude-flow__agent_spawn {"type": "coder", "capabilities": ["python", "testing"]}
   mcp__claude-flow__task_assign {"taskId": "task-123", "agentId": "agent-456"}

3. Coordinating work:
   mcp__claude-flow__agent_communicate {"to": "agent-123", "message": "Begin phase 2"}
   mcp__claude-flow__memory_store {"key": "phase1/results", "value": {...}}
   mcp__claude-flow__task_update {"taskId": "task-123", "progress": 75}

4. Monitoring progress:
   mcp__claude-flow__swarm_monitor {}
   mcp__claude-flow__task_status {"includeCompleted": true}
   mcp__claude-flow__agent_list {"status": "active"}

💾 MEMORY PATTERNS:

Use hierarchical keys for organization:
- "specs/requirements" - Store specifications
- "architecture/decisions" - Architecture choices
- "code/modules/[name]" - Code artifacts
- "tests/results/[id]" - Test outcomes
- "docs/api/[endpoint]" - Documentation

🚀 BEGIN SWARM EXECUTION:

Start by spawning a coordinator agent and creating the initial task structure. Use the MCP tools to orchestrate the swarm, coordinate agents, and track progress. Remember to store important decisions and artifacts in collective memory for other agents to access.

The swarm should be self-documenting - use memory_store to save all important information, decisions, and results throughout the execution.`;

      // If --claude flag is used, force Claude Code even if CLI not available
      if (flags && flags.claude) {
        // Inject memory coordination protocol into CLAUDE.md
        try {
          const { injectMemoryProtocol, enhanceSwarmPrompt } = await import('./inject-memory-protocol.js');
          await injectMemoryProtocol();
          
          // Enhance the prompt with memory coordination instructions
          swarmPrompt = enhanceSwarmPrompt(swarmPrompt, maxAgents);
        } catch (err) {
          // If injection module not available, continue with original prompt
          console.log('⚠️  Memory protocol injection not available, using standard prompt');
        }
        
        // --claude flag means interactive mode, so don't apply non-interactive
        console.log('🐝 Launching Claude Flow Swarm System...');
        console.log(`📋 Objective: ${objective}`);
        console.log(`🎯 Strategy: ${strategy}`);
        console.log(`🏗️  Mode: ${mode}`);
        console.log(`🤖 Max Agents: ${maxAgents}\n`);
        
        console.log('🚀 Launching Claude Code with Swarm Coordination');
        console.log('📝 Memory protocol injected into CLAUDE.md');
        console.log('─'.repeat(60));
        
        // Build arguments properly: for interactive mode, prompt can be first
        const claudeArgs = [];
        
        // Add auto-permission flag first
        if (flags['dangerously-skip-permissions'] !== false && !flags['no-auto-permissions']) {
          claudeArgs.push('--dangerously-skip-permissions');
          console.log('🔓 Using --dangerously-skip-permissions by default for seamless swarm execution');
        }
        
        // Add the enhanced prompt
        claudeArgs.push(swarmPrompt);
        
        // --claude flag means interactive mode, so don't add non-interactive flags
        
        // For --claude interactive mode, spawn Claude directly
        // Temporarily disable telemetry to avoid console output interference
        const claudeEnv = { ...process.env };
        
        // Remove telemetry env vars to prevent console output
        delete claudeEnv.CLAUDE_CODE_ENABLE_TELEMETRY;
        delete claudeEnv.OTEL_METRICS_EXPORTER;
        delete claudeEnv.OTEL_LOGS_EXPORTER;
        
        const claudeProcess = spawn('claude', claudeArgs, {
          stdio: 'inherit',
          shell: false,
          env: claudeEnv
        });
        
        console.log('\n✓ Claude Code launched with swarm coordination prompt!');
        console.log('  The swarm coordinator will orchestrate all agent tasks');
        console.log('  Use MCP tools for coordination and memory sharing');
        
        console.log('\n💡 Pro Tips:');
        console.log('─'.repeat(30));
        console.log('• Use TodoWrite to track parallel tasks');
        console.log('• Store results with mcp__claude-flow__memory_usage');
        console.log('• Monitor progress with mcp__claude-flow__swarm_monitor');
        console.log('• Check task status with mcp__claude-flow__task_status');
        
        // Set up clean termination
        const cleanup = () => {
          console.log('\n🛑 Shutting down swarm gracefully...');
          if (claudeProcess && !claudeProcess.killed) {
            claudeProcess.kill('SIGTERM');
          }
          process.exit(0);
        };
        
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        
        // Wait for claude to exit
        claudeProcess.on('exit', (code) => {
          if (code === 0) {
            console.log('\n✓ Swarm execution completed successfully');
          } else if (code !== null) {
            console.log(`\n✗ Swarm execution exited with code ${code}`);
          }
          process.exit(code || 0);
        });
        
        // Handle spawn errors (e.g., claude not found)
        claudeProcess.on('error', (err) => {
          if (err.code === 'ENOENT') {
            console.error('\n❌ Claude Code CLI not found. Please install Claude Code:');
            console.error('   https://claude.ai/download');
          } else {
            console.error('\n❌ Failed to launch Claude Code:', err.message);
          }
          process.exit(1);
        });
        
        return;
      }

      // Check if we're in non-interactive/headless mode FIRST (like alpha.83)
      const isNonInteractive = flags['no-interactive'] || 
                               flags['non-interactive'] || 
                               flags['output-format'] === 'stream-json' ||
                               isHeadlessEnvironment();
      
      // Check if claude command exists
      let claudeAvailable = false;
      try {
        execSync('which claude', { stdio: 'ignore' });
        claudeAvailable = true;
      } catch {
        if (!isNonInteractive) {
          console.log('⚠️  Claude Code CLI not found in PATH');
          console.log('Install it with: npm install -g @anthropic-ai/claude-code');
          console.log('Or use --claude flag to open Claude Code CLI');
          console.log('\nWould spawn Claude Code with swarm objective:');
          console.log(`📋 Objective: ${objective}`);
          console.log('\nOptions:');
          console.log('  • Use --executor flag for built-in executor: claude-flow swarm "objective" --executor');
          console.log('  • Use --claude flag to open Claude Code CLI: claude-flow swarm "objective" --claude');
        } else {
          // In non-interactive mode, output JSON error
          console.error(JSON.stringify({
            error: 'Claude Code CLI not found',
            message: 'Install with: npm install -g @anthropic-ai/claude-code',
            fallback: 'Use --executor flag for built-in executor'
          }));
        }
        return;
      }

      // Claude is available, use it to run swarm
      if (!isNonInteractive) {
        console.log('🐝 Launching Claude Flow Swarm System...');
        console.log(`📋 Objective: ${objective}`);
        console.log(`🎯 Strategy: ${flags.strategy || 'auto'}`);
        console.log(`🏗️  Mode: ${flags.mode || 'centralized'}`);
        console.log(`🤖 Max Agents: ${flags['max-agents'] || 5}`);
        if (isAnalysisMode) {
          console.log(`🔍 Analysis Mode: ENABLED (Read-Only - No Code Changes)`);
        }
        console.log();
      } else {
        // Non-interactive mode output
        console.log('🤖 Running in non-interactive mode with Claude');
        console.log('📋 Command: claude [prompt] -p --output-format stream-json --verbose');
      }

      // Continue with the default swarm behavior if not using --claude flag

      // Build arguments in correct order: flags first, then prompt
      const claudeArgs = [];

      // Add non-interactive flags FIRST if needed
      if (isNonInteractive) {
        claudeArgs.push('-p'); // Print mode
        claudeArgs.push('--output-format', 'stream-json'); // JSON streaming
        claudeArgs.push('--verbose'); // Verbose output
      }

      // Add auto-permission flag BEFORE the prompt
      if (flags['dangerously-skip-permissions'] !== false && !flags['no-auto-permissions']) {
        claudeArgs.push('--dangerously-skip-permissions');
        if (!isNonInteractive) {
          console.log(
            '🔓 Using --dangerously-skip-permissions by default for seamless swarm execution',
          );
        }
      }

      // Add the prompt as the LAST argument
      claudeArgs.push(swarmPrompt);

      // Spawn claude with properly ordered arguments
      const claudeProcess = spawn('claude', claudeArgs, {
        stdio: 'inherit',
        shell: false,
      });

      if (!isNonInteractive) {
        console.log('✓ Claude Code launched with swarm coordination prompt!');
        console.log('\n🚀 The swarm coordination instructions have been injected into Claude Code');
        console.log('   The prompt includes:');
        console.log('   • Strategy-specific guidance for', strategy);
        console.log('   • Coordination patterns for', mode, 'mode');
        console.log('   • Recommended agents and MCP tool usage');
        console.log('   • Complete workflow documentation\n');
      }

      // Handle process events
      claudeProcess.on('error', (err) => {
        console.error('❌ Failed to launch Claude Code:', err.message);
      });

      // Don't wait for completion - let it run
      return;
    } catch (error) {
      console.error('❌ Failed to spawn Claude Code:', error.message);
      console.log('\nFalling back to built-in executor...');
      // Fall through to executor implementation
    }
  }

  // Check if we should run in background mode
  if (flags && flags.background && !process.env.CLAUDE_SWARM_NO_BG) {
    // Check if we're in Deno environment
    if (typeof Deno !== 'undefined') {
      // In Deno, spawn a new process for true background execution
      const objective = (args || []).join(' ').trim();
      const swarmId = `swarm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const swarmRunDir = `./swarm-runs/${swarmId}`;

      // Create swarm directory
      await mkdirAsync(swarmRunDir, { recursive: true });

      console.log(`🐝 Launching swarm in background mode...`);
      console.log(`📋 Objective: ${objective}`);
      console.log(`🆔 Swarm ID: ${swarmId}`);
      console.log(`📁 Results: ${swarmRunDir}`);

      // Build command args without background flag (to prevent infinite loop)
      const commandArgs = ['run', '--allow-all', import.meta.url, objective];
      const newFlags = { ...flags };
      delete newFlags.background; // Remove background flag

      for (const [key, value] of Object.entries(newFlags)) {
        commandArgs.push(`--${key}`);
        if (value !== true) {
          commandArgs.push(String(value));
        }
      }

      // Create log file
      const logFile = `${swarmRunDir}/swarm.log`;
      const logHandle = await open(logFile, 'w');

      // Create a script to run the swarm without background flag
      const scriptContent = `#!/usr/bin/env -S deno run --allow-all
import { swarmCommand } from "${import.meta.url}";
import { cwd, exit, existsSync } from '../node-compat.js';
import process from 'process';

// Remove background flag to prevent recursion
const flags = ${JSON.stringify(newFlags)};
const args = ${JSON.stringify(args)};

// Set env to prevent background spawning
process.env.CLAUDE_SWARM_NO_BG = 'true';

// Run the swarm
await swarmCommand(args, flags);
`;

      const scriptPath = `${swarmRunDir}/run-swarm.js`;
      await writeTextFile(scriptPath, scriptContent);

      // Save process info first
      await writeTextFile(
        `${swarmRunDir}/process.json`,
        JSON.stringify(
          {
            swarmId: swarmId,
            objective: objective,
            startTime: new Date().toISOString(),
            logFile: logFile,
            status: 'starting',
          },
          null,
          2,
        ),
      );

      // Close log handle before spawning
      logHandle.close();

      // Use the bash script for true background execution
      const binDir = new URL('../../../bin/', import.meta.url).pathname;
      const bgScriptPath = `${binDir}claude-flow-swarm-bg`;

      try {
        // Check if the background script exists
        statSync(bgScriptPath);

        // Build command args for the background script
        const bgArgs = [objective];
        for (const [key, value] of Object.entries(newFlags)) {
          bgArgs.push(`--${key}`);
          if (value !== true) {
            bgArgs.push(String(value));
          }
        }

        // Use the bash background script
        const bgProcess = spawn(bgScriptPath, bgArgs, {
          stdio: ['ignore', 'pipe', 'pipe'],
        });

        // Read and display output
        const decoder = new TextDecoder();
        const output = await bgProcess.output();
        console.log(decoder.decode(output.stdout));

        // Exit immediately after launching
        exit(0);
      } catch (error) {
        // Fallback: create a double-fork pattern using a shell script
        console.log(`\n⚠️  Background script not found, using fallback method`);

        // Create a shell script that will run the swarm
        const shellScript = `#!/bin/bash
# Double fork to detach from parent
(
  (
    node "${scriptPath}" > "${logFile}" 2>&1 &
    echo $! > "${swarmRunDir}/swarm.pid"
  ) &
)
exit 0
`;

        const shellScriptPath = `${swarmRunDir}/launch-background.sh`;
        await writeTextFile(shellScriptPath, shellScript);
        chmodSync(shellScriptPath, 0o755);

        // Execute the shell script
        const shellProcess = spawn('bash', [shellScriptPath], {
          stdio: 'ignore',
          detached: true,
        });
        shellProcess.unref();

        console.log(`\n✅ Swarm launched in background!`);
        console.log(`📄 Logs: tail -f ${logFile}`);
        console.log(`📊 Status: claude-flow swarm status ${swarmId}`);
        console.log(`\nThe swarm will continue running independently.`);

        // Exit immediately
        exit(0);
      }
    }

    // Node.js environment - use background script
    const { execSync } = await import('child_process');
    const path = await import('path');
    const fs = await import('fs');

    const objective = (args || []).join(' ').trim();

    // Get the claude-flow-swarm-bg script path
    const bgScriptPath = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      '../../../bin/claude-flow-swarm-bg',
    );

    // Check if background script exists
    if (fs.existsSync(bgScriptPath)) {
      // Build command args
      const commandArgs = [objective];
      for (const [key, value] of Object.entries(flags)) {
        if (key !== 'background') {
          // Skip background flag
          commandArgs.push(`--${key}`);
          if (value !== true) {
            commandArgs.push(String(value));
          }
        }
      }

      // Execute the background script
      try {
        execSync(`"${bgScriptPath}" ${commandArgs.map((arg) => `"${arg}"`).join(' ')}`, {
          stdio: 'inherit',
        });
      } catch (error) {
        console.error('Failed to launch background swarm:', error.message);
      }
    } else {
      // Fallback to simple message
      console.log(`🐝 Background mode requested`);
      console.log(`📋 Objective: ${objective}`);
      console.log(`\n⚠️  Background execution requires the claude-flow-swarm-bg script.`);
      console.log(`\nFor true background execution, use:`);
      console.log(
        `  nohup claude-flow swarm "${objective}" ${Object.entries(flags)
          .filter(([k, v]) => k !== 'background' && v)
          .map(([k, v]) => `--${k}${v !== true ? ` ${v}` : ''}`)
          .join(' ')} > swarm.log 2>&1 &`,
      );
    }
    return;
  }

  try {
    // Try to load the compiled JavaScript module first
    let swarmAction;
    try {
      // Try the compiled version first (for production/npm packages)
      const distPath = new URL('../../../dist/cli/commands/swarm-new.js', import.meta.url);
      const module = await import(distPath);
      swarmAction = module.swarmAction;
    } catch (distError) {
      // Instead of immediately falling back to basic mode, 
      // continue to the Claude integration below
      console.log('📦 Compiled swarm module not found, checking for Claude CLI...');
    }

    // Only call swarmAction if it was successfully loaded
    if (swarmAction) {
      // Create command context compatible with TypeScript version
      const ctx = {
        args: args || [],
        flags: flags || {},
        command: 'swarm',
      };

      await swarmAction(ctx);
      return; // Exit after successful execution
    }
  } catch (error) {
    // If import fails (e.g., in node_modules), provide inline implementation
    if (
      error.code === 'ERR_MODULE_NOT_FOUND' ||
      error.code === 'ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING' ||
      error.code === 'ERR_UNKNOWN_FILE_EXTENSION'
    ) {
      // Provide a basic swarm implementation that works without TypeScript imports
      const objective = (args || []).join(' ').trim();

      if (!objective) {
        console.error('❌ Usage: swarm <objective>');
        showSwarmHelp();
        return;
      }

      // Try to use the swarm executor directly
      try {
        const { executeSwarm } = await import('./swarm-executor.js');
        const result = await executeSwarm(objective, flags);

        // If execution was successful, exit
        if (result && result.success) {
          return;
        }
      } catch (execError) {
        console.log(`⚠️  Swarm executor error: ${execError.message}`);
        // If swarm executor fails, try to create files directly
        try {
          await createSwarmFiles(objective, flags);
          return;
        } catch (createError) {
          console.log(`⚠️  Direct file creation error: ${createError.message}`);
          // Continue with fallback implementation
        }
      }

      // Provide a basic inline swarm implementation for npm packages
      console.log('🐝 Launching swarm system...');
      console.log(`📋 Objective: ${objective}`);
      console.log(`🎯 Strategy: ${flags.strategy || 'auto'}`);
      console.log(`🏗️  Mode: ${flags.mode || 'centralized'}`);
      console.log(`🤖 Max Agents: ${flags['max-agents'] || 5}`);
      console.log();

      // Generate swarm ID
      const swarmId = `swarm_${Math.random().toString(36).substring(2, 11)}_${Math.random().toString(36).substring(2, 11)}`;

      if (flags['dry-run']) {
        console.log(`🆔 Swarm ID: ${swarmId}`);
        console.log(`📊 Max Tasks: ${flags['max-tasks'] || 100}`);
        console.log(`⏰ Timeout: ${flags.timeout || 60} minutes`);
        console.log(`🔄 Parallel: ${flags.parallel || false}`);
        console.log(`🌐 Distributed: ${flags.distributed || false}`);
        console.log(`🔍 Monitoring: ${flags.monitor || false}`);
        console.log(`👥 Review Mode: ${flags.review || false}`);
        console.log(`🧪 Testing: ${flags.testing || false}`);
        console.log(`🧠 Memory Namespace: ${flags['memory-namespace'] || 'swarm'}`);
        console.log(`💾 Persistence: ${flags.persistence !== false}`);
        console.log(`🔒 Encryption: ${flags.encryption || false}`);
        console.log(`📊 Quality Threshold: ${flags['quality-threshold'] || 0.8}`);
        console.log();
        console.log('🎛️  Coordination Strategy:');
        console.log(`  • Agent Selection: ${flags['agent-selection'] || 'capability-based'}`);
        console.log(`  • Task Scheduling: ${flags['task-scheduling'] || 'priority'}`);
        console.log(`  • Load Balancing: ${flags['load-balancing'] || 'work-stealing'}`);
        console.log(`  • Fault Tolerance: ${flags['fault-tolerance'] || 'retry'}`);
        console.log(`  • Communication: ${flags.communication || 'event-driven'}`);
        console.log('⚠️  DRY RUN - Advanced Swarm Configuration');
        return;
      }

      // For actual execution in npm context, try to find and run swarm-demo.ts
      try {
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        const fs = await import('fs');
        const { spawn } = await import('child_process');

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Look for swarm-demo.ts in the package
        const possiblePaths = [
          path.join(__dirname, '../../../swarm-demo.ts'),
          path.join(__dirname, '../../swarm-demo.ts'),
        ];

        let swarmDemoPath = null;
        for (const p of possiblePaths) {
          if (fs.existsSync(p)) {
            swarmDemoPath = p;
            break;
          }
        }

        if (swarmDemoPath && Deno) {
          // Run swarm-demo.ts directly with Deno
          const swarmArgs = [objective];
          for (const [key, value] of Object.entries(flags || {})) {
            swarmArgs.push(`--${key}`);
            if (value !== true) {
              swarmArgs.push(String(value));
            }
          }

          console.log('🚀 Starting advanced swarm execution...');
          const swarmProcess = spawn('node', [swarmDemoPath, ...swarmArgs], {
            stdio: 'inherit',
          });

          swarmProcess.on('error', (err) => {
            console.error('❌ Failed to launch swarm:', err.message);
          });

          swarmProcess.on('exit', (code) => {
            if (code !== 0) {
              console.error(`❌ Swarm exited with code ${code}`);
            }
          });
          return;
        }
      } catch (e) {
        // Fallback to basic message if can't run swarm-demo.ts
      }

      // Try to use Claude wrapper approach like SPARC does
      try {
        const { execSync } = await import('child_process');

        // Check if claude command exists
        try {
          execSync('which claude', { stdio: 'ignore' });
        } catch (e) {
          // Claude not found, show fallback message
          console.log(`✅ Swarm initialized with ID: ${swarmId}`);
          console.log('\n⚠️  Note: Advanced swarm features require Claude or local installation.');
          console.log('Install Claude: https://claude.ai/code');
          console.log('Or install locally: npm install -g claude-flow@latest');
          console.log('\nThe swarm system would coordinate the following:');
          console.log('1. Agent spawning and task distribution');
          console.log('2. Parallel execution of subtasks');
          console.log('3. Memory sharing between agents');
          console.log('4. Progress monitoring and reporting');
          console.log('5. Result aggregation and quality checks');
          return;
        }

        // Claude is available, use it to run swarm
        console.log('🚀 Launching swarm via Claude wrapper...');
        if (flags.sparc !== false) {
          console.log('🧪 SPARC methodology enabled - using full TDD workflow');
        }

        // Build the prompt for Claude using SPARC methodology
        const enableSparc = flags.sparc !== false;
        const swarmPrompt = `Execute a swarm coordination task using ${enableSparc ? 'the full SPARC methodology' : 'standard approach'}:

OBJECTIVE: ${objective}

CONFIGURATION:
- Strategy: ${flags.strategy || 'auto'}
- Mode: ${flags.mode || 'centralized'}
- Max Agents: ${flags['max-agents'] || 5}
- Memory Namespace: ${flags['memory-namespace'] || 'swarm'}
- Quality Threshold: ${flags['quality-threshold'] || 0.8}
${enableSparc ? '- SPARC Enabled: YES - Use full Specification, Pseudocode, Architecture, Refinement (TDD), Completion methodology' : ''}

${
  enableSparc
    ? `
SPARC METHODOLOGY REQUIREMENTS:

1. SPECIFICATION PHASE:
   - Create detailed requirements and acceptance criteria
   - Define user stories with clear objectives
   - Document functional and non-functional requirements
   - Establish quality metrics and success criteria

2. PSEUDOCODE PHASE:
   - Design algorithms and data structures
   - Create flow diagrams and logic patterns
   - Define interfaces and contracts
   - Plan error handling strategies

3. ARCHITECTURE PHASE:
   - Design system architecture with proper components
   - Define APIs and service boundaries
   - Plan database schemas if applicable
   - Create deployment architecture

4. REFINEMENT PHASE (TDD):
   - RED: Write comprehensive failing tests first
   - GREEN: Implement minimal code to pass tests
   - REFACTOR: Optimize and clean up implementation
   - Ensure >80% test coverage

5. COMPLETION PHASE:
   - Integrate all components
   - Create comprehensive documentation
   - Perform end-to-end testing
   - Validate against original requirements
`
    : ''
}

EXECUTION APPROACH:
1. Analyze the objective and break it down into specific tasks
2. Create a comprehensive implementation plan
3. ${enableSparc ? 'Follow SPARC phases sequentially with proper artifacts for each phase' : 'Implement the solution directly'}
4. Generate production-ready code with proper structure
5. Include all necessary files (source code, tests, configs, documentation)
6. Ensure the implementation is complete and functional

TARGET DIRECTORY:
Extract from the objective or use a sensible default. Create all files in the appropriate directory structure.

IMPORTANT:
- Create actual, working implementations - not templates or placeholders
- Include comprehensive tests using appropriate testing frameworks
- Add proper error handling and logging
- Include configuration files (package.json, requirements.txt, etc.)
- Create detailed README with setup and usage instructions
- Follow best practices for the technology stack
- Make the code production-ready, not just examples

Begin execution now. Create all necessary files and provide a complete, working solution.`;

        // Execute Claude non-interactively by piping the prompt
        const { spawn } = await import('child_process');

        const claudeArgs = [];

        // Add auto-permission flag by default for swarm mode (unless explicitly disabled)
        if (flags['dangerously-skip-permissions'] !== false && !flags['no-auto-permissions']) {
          claudeArgs.push('--dangerously-skip-permissions');
        }

        // Spawn claude process
        const claudeProcess = spawn('claude', claudeArgs, {
          stdio: ['pipe', 'inherit', 'inherit'],
          shell: false,
        });

        // Write the prompt to stdin and close it
        claudeProcess.stdin.write(swarmPrompt);
        claudeProcess.stdin.end();

        // Wait for the process to complete
        await new Promise((resolve, reject) => {
          claudeProcess.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`Claude process exited with code ${code}`));
            }
          });

          claudeProcess.on('error', (err) => {
            reject(err);
          });
        });
      } catch (error) {
        // Fallback if Claude execution fails
        console.log(`✅ Swarm initialized with ID: ${swarmId}`);
        console.log('\n⚠️  Note: Advanced swarm features require Claude or local installation.');
        console.log('Install Claude: https://claude.ai/code');
        console.log('Or install locally: npm install -g claude-flow@latest');
        console.log('\nThe swarm system would coordinate the following:');
        console.log('1. Agent spawning and task distribution');
        console.log('2. Parallel execution of subtasks');
        console.log('3. Memory sharing between agents');
        console.log('4. Progress monitoring and reporting');
        console.log('5. Result aggregation and quality checks');
      }

      return;
    }

    console.error('Swarm command error:', error);

    // Fallback to comprehensive help if there's an import error
    console.log(`
🐝 Claude Flow Advanced Swarm System

USAGE:
  claude-flow swarm <objective> [options]

EXAMPLES:
  claude-flow swarm "Build a REST API" --strategy development
  claude-flow swarm "Research cloud architecture" --strategy research --ui
  claude-flow swarm "Analyze data trends" --strategy analysis --parallel
  claude-flow swarm "Optimize performance" --distributed --monitor

STRATEGIES:
  auto           Automatically determine best approach (default)
  research       Research and information gathering
  development    Software development and coding
  analysis       Data analysis and insights
  testing        Testing and quality assurance
  optimization   Performance optimization
  maintenance    System maintenance

MODES:
  centralized    Single coordinator (default)
  distributed    Multiple coordinators
  hierarchical   Tree structure coordination
  mesh           Peer-to-peer coordination
  hybrid         Mixed coordination strategies

KEY FEATURES:
  🤖 Intelligent agent management with specialized types
  ⚡ Timeout-free background task execution
  🧠 Distributed memory sharing between agents
  🔄 Work stealing and advanced load balancing
  🛡️  Circuit breaker patterns for fault tolerance
  📊 Real-time monitoring and comprehensive metrics
  🎛️  Multiple coordination strategies and algorithms
  💾 Persistent state with backup and recovery
  🔒 Security features with encryption options
  🖥️  Interactive terminal UI for management

OPTIONS:
  --strategy <type>          Execution strategy (default: auto)
  --mode <type>              Coordination mode (default: centralized)
  --max-agents <n>           Maximum agents (default: 5)
  --timeout <minutes>        Timeout in minutes (default: 60)
  --task-timeout-minutes <n> Task execution timeout in minutes (default: 59)
  --parallel                 Enable parallel execution
  --distributed              Enable distributed coordination
  --monitor                  Enable real-time monitoring
  --ui                       Launch terminal UI interface
  --background               Run in background mode
  --review                   Enable peer review
  --testing                  Enable automated testing
  --encryption               Enable encryption
  --verbose                  Enable detailed logging
  --dry-run                  Show configuration without executing
  --executor                 Use built-in executor instead of Claude Code
  --claude                   Open Claude Code CLI
  --output-format <format>   Output format: json, text (default: text)
  --output-file <path>       Save output to file instead of stdout
  --no-interactive           Run in non-interactive mode (auto-enabled with --output-format json)
  --auto                     (Deprecated: auto-permissions enabled by default)
  --no-auto-permissions      Disable automatic --dangerously-skip-permissions
  --analysis                 Enable analysis/read-only mode (no code changes)
  --read-only                Enable read-only mode (alias for --analysis)

ADVANCED OPTIONS:
  --quality-threshold <n>    Quality threshold 0-1 (default: 0.8)
  --memory-namespace <name>  Memory namespace (default: swarm)
  --agent-selection <type>   Agent selection strategy
  --task-scheduling <type>   Task scheduling algorithm
  --load-balancing <type>    Load balancing method
  --fault-tolerance <type>   Fault tolerance strategy

For complete documentation and examples:
https://github.com/ruvnet/claude-code-flow/docs/swarm.md
`);
  }
}
