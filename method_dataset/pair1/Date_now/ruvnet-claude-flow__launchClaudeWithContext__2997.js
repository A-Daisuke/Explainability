async function launchClaudeWithContext(prompt, flags, sessionId) {
  try {
    // ALWAYS save the prompt file first (fix for issue #330)
    // Ensure sessions directory exists
    const sessionsDir = path.join('.hive-mind', 'sessions');
    await mkdirAsync(sessionsDir, { recursive: true });
    const promptFile = path.join(sessionsDir, `hive-mind-resume-${sessionId}-${Date.now()}.txt`);
    await writeFile(promptFile, prompt);
    console.log(chalk.green(`\n✓ Session context saved to: ${promptFile}`));

    const { spawn: childSpawn, execSync } = await import('child_process');
    let claudeAvailable = false;

    try {
      execSync('which claude', { stdio: 'ignore' });
      claudeAvailable = true;
    } catch {
      console.log(chalk.yellow('\n⚠️  Claude Code CLI not found'));
      console.log(chalk.gray('Install Claude Code: npm install -g @anthropic-ai/claude-code'));
      console.log(chalk.gray(`Run with: claude < ${promptFile}`));
      return;
    }

    if (claudeAvailable && !flags.dryRun) {
      // Debug logging to track spawn calls
      console.log(chalk.blue('\n🔍 Debug: About to spawn Claude Code process...'));
      console.log(chalk.gray(`  Session ID: ${sessionId}`));
      console.log(chalk.gray(`  Process ID: ${process.pid}`));
      
      // Remove --print to allow interactive session (same as initial spawn)
      const claudeArgs = [prompt];

      // Add --dangerously-skip-permissions by default for hive-mind operations
      // unless explicitly disabled with --no-auto-permissions
      if (!flags['no-auto-permissions']) {
        claudeArgs.push('--dangerously-skip-permissions');
        console.log(
          chalk.yellow(
            '🔓 Using --dangerously-skip-permissions by default for seamless hive-mind execution',
          ),
        );
      }

      console.log(chalk.blue('🔍 Debug: Spawning with args:'), claudeArgs.slice(0, 1).map(a => a.substring(0, 50) + '...'));
      
      // Use 'inherit' for interactive session (same as initial spawn)
      const claudeProcess = childSpawn('claude', claudeArgs, {
        stdio: 'inherit',
        shell: false,
      });
      
      console.log(chalk.blue('🔍 Debug: Claude process spawned with PID:'), claudeProcess.pid);

      // Track child process PID in session (same as initial spawn)
      const sessionManager = new HiveMindSessionManager();
      if (claudeProcess.pid) {
        const sessions = await sessionManager.getActiveSessions();
        const currentSession = sessions.find(s => s.id === sessionId);
        if (currentSession) {
          await sessionManager.addChildPid(currentSession.id, claudeProcess.pid);
        }
      }

      // Set up SIGINT handler for automatic session pausing (same as initial spawn)
      let isExiting = false;
      const sigintHandler = async () => {
        if (isExiting) return;
        isExiting = true;

        console.log('\n\n' + chalk.yellow('⏸️  Pausing session and terminating Claude Code...'));
        
        try {
          // Terminate Claude Code process if still running
          if (claudeProcess && !claudeProcess.killed) {
            claudeProcess.kill('SIGTERM');
          }
          
          // Clean up and close session manager
          sessionManager.close();
          
          console.log(chalk.green('✓') + ' Session paused successfully');
          console.log(chalk.cyan('\nTo resume this session, run:'));
          console.log(chalk.bold(`  claude-flow hive-mind resume ${sessionId}`));
          console.log();
          
          process.exit(0);
        } catch (error) {
          console.error(chalk.red('Error during shutdown:'), error.message);
          process.exit(1);
        }
      };

      process.on('SIGINT', sigintHandler);
      process.on('SIGTERM', sigintHandler);

      // Handle process exit (same as initial spawn)
      claudeProcess.on('exit', async (code, signal) => {
        if (!isExiting) {
          console.log('\n' + chalk.yellow('Claude Code has exited'));
          
          // Clean up signal handlers
          process.removeListener('SIGINT', sigintHandler);
          process.removeListener('SIGTERM', sigintHandler);
          
          // Close session manager
          sessionManager.close();
          
          process.exit(code || 0);
        }
      });

      console.log(chalk.green('\n✓ Claude Code launched with restored session context'));
      console.log(chalk.gray(`  Prompt file saved at: ${promptFile}`));
    }
  } catch (error) {
    console.error(chalk.red('Failed to launch Claude Code:'), error.message);
  }
}
