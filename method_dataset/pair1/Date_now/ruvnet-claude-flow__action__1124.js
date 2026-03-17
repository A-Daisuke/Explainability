function __method_wrapper__() {
    action: async (ctx: CommandContext) => {
      const subcommand = ctx.args[0];

      switch (subcommand) {
        case 'spawn': {
          // Find where flags start (arguments starting with -)
          let taskEndIndex = ctx.args.length;
          for (let i = 1; i < ctx.args.length; i++) {
            if (ctx.args[i].startsWith('-')) {
              taskEndIndex = i;
              break;
            }
          }

          const task = ctx.args.slice(1, taskEndIndex).join(' ');
          if (!task) {
            error('Usage: claude spawn <task description>');
            break;
          }

          try {
            // Build allowed tools list
            let tools =
              (ctx.flags.tools as string) || 'View,Edit,Replace,GlobTool,GrepTool,LS,Bash';

            if (ctx.flags.parallel) {
              tools += ',BatchTool,dispatch_agent';
            }

            if (ctx.flags.research) {
              tools += ',WebFetchTool';
            }

            const instanceId = `claude-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Build enhanced task with Claude-Flow guidance
            let enhancedTask = `# Claude-Flow Enhanced Task

## Your Task
${task}

## Claude-Flow System Context

You are running within the Claude-Flow orchestration system, which provides powerful features for complex task management:

### Available Features

1. **Memory Bank** (Always Available)
   - Store data: \`npx claude-flow memory store <key> <value>\` - Save important data, findings, or progress
   - Retrieve data: \`npx claude-flow memory query <key>\` - Access previously stored information
   - Check status: \`npx claude-flow status\` - View current system/task status
   - List agents: \`npx claude-flow agent list\` - See active agents
   - Memory persists across Claude instances in the same namespace

2. **Tool Access**
   - You have access to these tools: ${tools}`;

            if (ctx.flags.parallel) {
              enhancedTask += `
   - **Parallel Execution Enabled**: Use \`npx claude-flow agent spawn <type> --name <name>\` to spawn sub-agents
   - Create tasks: \`npx claude-flow task create <type> "<description>"\`
   - Assign tasks: \`npx claude-flow task assign <task-id> <agent-id>\`
   - Break down complex tasks and delegate to specialized agents`;
            }

            if (ctx.flags.research) {
              enhancedTask += `
   - **Research Mode**: Use \`WebFetchTool\` for web research and information gathering`;
            }

            enhancedTask += `

### Workflow Guidelines

1. **Before Starting**:
   - Check memory: \`npx claude-flow memory query previous_work\`
   - Check system status: \`npx claude-flow status\`
   - List active agents: \`npx claude-flow agent list\`
   - List active tasks: \`npx claude-flow task list\`

2. **During Execution**:
   - Store findings: \`npx claude-flow memory store findings "your data here"\`
   - Save checkpoints: \`npx claude-flow memory store progress_${task.replace(/\s+/g, '_')} "current status"\`
   ${ctx.flags.parallel ? '- Spawn agents: `npx claude-flow agent spawn researcher --name "research-agent"`' : ''}
   ${ctx.flags.parallel ? '- Create tasks: `npx claude-flow task create implementation "implement feature X"`' : ''}

3. **Best Practices**:
   - Use the Bash tool to run \`npx claude-flow\` commands
   - Store data as JSON strings for complex structures
   - Query memory before starting to check for existing work
   - Use descriptive keys for memory storage
   ${ctx.flags.parallel ? '- Coordinate with other agents through shared memory' : ''}
   ${ctx.flags.research ? '- Store research findings: `npx claude-flow memory store research_findings "data"`' : ''}

## Configuration
- Instance ID: ${instanceId}
- Mode: ${ctx.flags.mode || 'full'}
- Coverage Target: ${ctx.flags.coverage || 80}%
- Commit Strategy: ${ctx.flags.commit || 'phase'}

## Example Commands

To interact with Claude-Flow, use the Bash tool:

\`\`\`bash
# Check for previous work
Bash("npx claude-flow memory query previous_work")

# Store your findings
Bash("npx claude-flow memory store analysis_results 'Found 3 critical issues...'")

# Check system status
Bash("npx claude-flow status")

# Create and assign tasks (when --parallel is enabled)
Bash("npx claude-flow task create research 'Research authentication methods'")
Bash("npx claude-flow agent spawn researcher --name auth-researcher")
\`\`\`

Now, please proceed with the task: ${task}`;

            // Build Claude command with enhanced task
            const claudeCmd = ['claude', enhancedTask];
            claudeCmd.push('--allowedTools', tools);

            if (ctx.flags.noPermissions || ctx.flags['skip-permissions']) {
              claudeCmd.push('--dangerously-skip-permissions');
            }

            if (ctx.flags.config) {
              claudeCmd.push('--mcp-config', ctx.flags.config as string);
            }

            if (ctx.flags.verbose) {
              claudeCmd.push('--verbose');
            }

            if (ctx.flags.dryRun || ctx.flags['dry-run'] || ctx.flags.d) {
              warning('DRY RUN - Would execute:');
              console.log(
                `Command: claude "<enhanced task with guidance>" --allowedTools ${tools}`,
              );
              console.log(`Instance ID: ${instanceId}`);
              console.log(`Original Task: ${task}`);
              console.log(`Tools: ${tools}`);
              console.log(`Mode: ${ctx.flags.mode || 'full'}`);
              console.log(`Coverage: ${ctx.flags.coverage || 80}%`);
              console.log(`Commit: ${ctx.flags.commit || 'phase'}`);
              console.log(`\nEnhanced Features:`);
              console.log(`  - Memory Bank enabled via: npx claude-flow memory commands`);
              console.log(`  - Coordination ${ctx.flags.parallel ? 'enabled' : 'disabled'}`);
              console.log(`  - Access Claude-Flow features through Bash tool`);
              return;
            }

            success(`Spawning Claude instance: ${instanceId}`);
            console.log(`📝 Original Task: ${task}`);
            console.log(`🔧 Tools: ${tools}`);
            console.log(`⚙️  Mode: ${ctx.flags.mode || 'full'}`);
            console.log(`📊 Coverage: ${ctx.flags.coverage || 80}%`);
            console.log(`💾 Commit: ${ctx.flags.commit || 'phase'}`);
            console.log(`✨ Enhanced with Claude-Flow guidance for memory and coordination`);
            console.log('');
            console.log('📋 Task will be enhanced with:');
            console.log('  - Memory Bank instructions (store/retrieve)');
            console.log('  - Coordination capabilities (swarm management)');
            console.log('  - Best practices for multi-agent workflows');
            console.log('');

            // Execute Claude command
            const { spawn } = await import('child_process');
            const child = spawn(
              'claude',
              claudeCmd.slice(1).map((arg) => arg.replace(/^"|"$/g, '')),
              {
                env: {
                  ...process.env,
                  CLAUDE_INSTANCE_ID: instanceId,
                  CLAUDE_FLOW_MODE: (ctx.flags.mode as string) || 'full',
                  CLAUDE_FLOW_COVERAGE: (ctx.flags.coverage || 80).toString(),
                  CLAUDE_FLOW_COMMIT: (ctx.flags.commit as string) || 'phase',
                  // Add Claude-Flow specific features
                  CLAUDE_FLOW_MEMORY_ENABLED: 'true',
                  CLAUDE_FLOW_MEMORY_NAMESPACE: 'default',
                  CLAUDE_FLOW_COORDINATION_ENABLED: ctx.flags.parallel ? 'true' : 'false',
                  CLAUDE_FLOW_FEATURES: 'memory,coordination,swarm',
                },
                stdio: 'inherit',
              },
            );

            const status = await new Promise((resolve) => {
              child.on('close', (code) => {
                resolve({ success: code === 0, code });
              });
            });

            if ((status as any).success) {
              success(`Claude instance ${instanceId} completed successfully`);
            } else {
              error(`Claude instance ${instanceId} exited with code ${(status as any).code}`);
            }
          } catch (err) {
            error(`Failed to spawn Claude: ${(err as Error).message}`);
          }
          break;
        }

        case 'batch': {
          const workflowFile = ctx.args[1];
          if (!workflowFile) {
            error('Usage: claude batch <workflow-file>');
            break;
          }

          try {
            const { readFile } = await import('fs/promises');
            const content = await readFile(workflowFile, 'utf-8');
            const workflow = JSON.parse(content);

            success(`Loading workflow: ${workflow.name || 'Unnamed'}`);
            console.log(`📋 Tasks: ${workflow.tasks?.length || 0}`);

            if (!workflow.tasks || workflow.tasks.length === 0) {
              warning('No tasks found in workflow');
              return;
            }

            const promises = [];

            for (const task of workflow.tasks) {
              const claudeCmd = ['claude', `"${task.description || task.name}"`];

              // Add tools
              if (task.tools) {
                const toolsList = Array.isArray(task.tools) ? task.tools.join(',') : task.tools;
                claudeCmd.push('--allowedTools', toolsList);
              }

              // Add flags
              if (task.skipPermissions || task.dangerouslySkipPermissions) {
                claudeCmd.push('--dangerously-skip-permissions');
              }

              if (task.config) {
                claudeCmd.push('--mcp-config', task.config);
              }

              const taskId =
                task.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

              if (ctx.flags.dryRun || ctx.flags['dry-run']) {
                console.log(`\n${yellow('DRY RUN')} - Task: ${task.name || taskId}`);
                console.log(`Command: ${claudeCmd.join(' ')}`);
                continue;
              }

              console.log(`\n🚀 Spawning Claude for task: ${task.name || taskId}`);

              const { spawn } = await import('child_process');
              const child = spawn(
                'claude',
                claudeCmd.slice(1).map((arg) => arg.replace(/^"|"$/g, '')),
                {
                  env: {
                    ...process.env,
                    CLAUDE_TASK_ID: taskId,
                    CLAUDE_TASK_TYPE: task.type || 'general',
                  },
                  stdio: 'inherit',
                },
              );

              if (workflow.parallel) {
                promises.push(
                  new Promise((resolve) => {
                    child.on('close', (code) => {
                      resolve({ success: code === 0, code });
                    });
                  }),
                );
              } else {
                // Wait for completion if sequential
                const status = await new Promise((resolve) => {
                  child.on('close', (code) => {
                    resolve({ success: code === 0, code });
                  });
                });
                if (!(status as any).success) {
                  error(`Task ${taskId} failed with code ${(status as any).code}`);
                }
              }
            }

            if (workflow.parallel && promises.length > 0) {
              success('All Claude instances spawned in parallel mode');
              const results = await Promise.all(promises);
              const failed = results.filter((s: any) => !s.success).length;
              if (failed > 0) {
                warning(`${failed} tasks failed`);
              } else {
                success('All tasks completed successfully');
              }
            }
          } catch (err) {
            error(`Failed to process workflow: ${(err as Error).message}`);
          }
          break;
        }

        default: {
          console.log('Available subcommands: spawn, batch');
          console.log('\nExamples:');
          console.log(
            '  claude-flow claude spawn "implement user authentication" --research --parallel',
          );
          console.log('  claude-flow claude spawn "fix bug in payment system" --no-permissions');
          console.log('  claude-flow claude batch workflow.json --dry-run');
          break;
        }
      }
    },

}
