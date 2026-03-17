function __method_wrapper__() {
  .action(async (options: StartOptions) => {
    console.log(chalk.cyan('🧠 Claude-Flow Orchestration System'));
    console.log(chalk.gray('─'.repeat(60)));

    try {
      // Check if already running
      if (!options.force && (await isSystemRunning())) {
        console.log(chalk.yellow('⚠ Claude-Flow is already running'));
        const { shouldContinue } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldContinue',
            message: 'Stop existing instance and restart?',
            default: false,
          },
        ]);

        if (!shouldContinue) {
          console.log(chalk.gray('Use --force to override or "claude-flow stop" first'));
          return;
        }

        await stopExistingInstance();
      }

      // Perform pre-flight checks
      if (options.healthCheck) {
        console.log(chalk.blue('Running pre-flight health checks...'));
        await performHealthChecks();
      }

      // Initialize process manager with timeout
      const processManager = new ProcessManager();
      console.log(chalk.blue('Initializing system components...'));
      const initPromise = processManager.initialize(options.config);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Initialization timeout')),
          (options.timeout || 30) * 1000,
        ),
      );

      await Promise.race([initPromise, timeoutPromise]);

      // Initialize system monitor with enhanced monitoring
      const systemMonitor = new SystemMonitor(processManager);
      systemMonitor.start();

      // Setup system event handlers
      setupSystemEventHandlers(processManager, systemMonitor, options);

      // Override MCP settings from CLI options
      if (options.port) {
        const mcpProcess = processManager.getProcess('mcp-server');
        if (mcpProcess) {
          mcpProcess.config = { ...mcpProcess.config, port: options.port };
        }
      }

      // Configure transport settings
      if (options.mcpTransport) {
        const mcpProcess = processManager.getProcess('mcp-server');
        if (mcpProcess) {
          mcpProcess.config = { ...mcpProcess.config, transport: options.mcpTransport };
        }
      }

      // Setup event listeners for logging
      if (options.verbose) {
        setupVerboseLogging(systemMonitor);
      }

      // Launch UI mode
      if (options.ui) {
        // Check if web server is available
        try {
          const { ClaudeCodeWebServer } = await import('../../simple-commands/web-server.js');

          // Start the web server
          console.log(chalk.blue('Starting Web UI server...'));
          const webServer = new ClaudeCodeWebServer(options.port);
          await webServer.start();

          // Open browser if possible
          const openCommand =
            process.platform === 'darwin'
              ? 'open'
              : process.platform === 'win32'
                ? 'start'
                : 'xdg-open';

          try {
            const { exec } = await import('child_process');
            exec(`${openCommand} http://localhost:${options.port}/console`);
          } catch {
            // Browser opening failed, that's okay
          }

          // Keep process running
          console.log(
            chalk.green('✨ Web UI is running at:'),
            chalk.cyan(`http://localhost:${options.port}/console`),
          );
          console.log(chalk.gray('Press Ctrl+C to stop'));

          // Handle shutdown
          const shutdownWebUI = async () => {
            console.log('\n' + chalk.yellow('Shutting down Web UI...'));
            await webServer.stop();
            systemMonitor.stop();
            await processManager.stopAll();
            console.log(chalk.green('✓ Shutdown complete'));
            process.exit(0);
          };

          Deno.addSignalListener('SIGINT', shutdownWebUI);
          Deno.addSignalListener('SIGTERM', shutdownWebUI);

          // Keep process alive
          await new Promise<void>(() => {});
        } catch (webError) {
          // Fall back to TUI if web server is not available
          console.log(chalk.yellow('Web UI not available, falling back to Terminal UI'));
          const ui = new ProcessUI(processManager);
          await ui.start();

          // Cleanup on exit
          systemMonitor.stop();
          await processManager.stopAll();
          console.log(chalk.green.bold('✓'), 'Shutdown complete');
          process.exit(0);
        }
      }
      // Daemon mode
      else if (options.daemon) {
        console.log(chalk.yellow('Starting in daemon mode...'));

        // Auto-start all processes
        if (options.autoStart) {
          console.log(chalk.blue('Starting all system processes...'));
          await startWithProgress(processManager, 'all');
        } else {
          // Start only core processes
          console.log(chalk.blue('Starting core processes...'));
          await startWithProgress(processManager, 'core');
        }

        // Create PID file with metadata
        const pid = Deno.pid;
        const pidData = {
          pid,
          startTime: Date.now(),
          config: options.config || 'default',
          processes: processManager.getAllProcesses().map((p) => ({ id: p.id, status: p.status })),
        };
        await fs.writeFile('.claude-flow.pid', JSON.stringify(pidData, null, 2));
        console.log(chalk.gray(`Process ID: ${pid}`));

        // Wait for services to be fully ready
        await waitForSystemReady(processManager);

        console.log(chalk.green.bold('✓'), 'Daemon started successfully');
        console.log(chalk.gray('Use "claude-flow status" to check system status'));
        console.log(chalk.gray('Use "claude-flow monitor" for real-time monitoring'));

        // Keep process running
        await new Promise<void>(() => {});
      }
      // Interactive mode (default)
      else {
        console.log(chalk.cyan('Starting in interactive mode...'));
        console.log();

        // Show available options
        console.log(chalk.white.bold('Quick Actions:'));
        console.log('  [1] Start all processes');
        console.log('  [2] Start core processes only');
        console.log('  [3] Launch process management UI');
        console.log('  [4] Show system status');
        console.log('  [q] Quit');
        console.log();
        console.log(chalk.gray('Press a key to select an option...'));

        // Handle user input
        const decoder = new TextDecoder();
        while (true) {
          const buf = new Uint8Array(1);
          await Deno.stdin.read(buf);
          const key = decoder.decode(buf);

          switch (key) {
            case '1':
              console.log(chalk.cyan('\nStarting all processes...'));
              await startWithProgress(processManager, 'all');
              console.log(chalk.green.bold('✓'), 'All processes started');
              break;

            case '2':
              console.log(chalk.cyan('\nStarting core processes...'));
              await startWithProgress(processManager, 'core');
              console.log(chalk.green.bold('✓'), 'Core processes started');
              break;

            case '3':
              const ui = new ProcessUI(processManager);
              await ui.start();
              break;

            case '4':
              console.clear();
              systemMonitor.printSystemHealth();
              console.log();
              systemMonitor.printEventLog(10);
              console.log();
              console.log(chalk.gray('Press any key to continue...'));
              await Deno.stdin.read(new Uint8Array(1));
              break;

            case 'q':
            case 'Q':
              console.log(chalk.yellow('\nShutting down...'));
              await processManager.stopAll();
              systemMonitor.stop();
              console.log(chalk.green.bold('✓'), 'Shutdown complete');
              process.exit(0);
              break;
          }

          // Redraw menu
          console.clear();
          console.log(chalk.cyan('🧠 Claude-Flow Interactive Mode'));
          console.log(chalk.gray('─'.repeat(60)));

          // Show current status
          const stats = processManager.getSystemStats();
          console.log(
            chalk.white('System Status:'),
            chalk.green(`${stats.runningProcesses}/${stats.totalProcesses} processes running`),
          );
          console.log();

          console.log(chalk.white.bold('Quick Actions:'));
          console.log('  [1] Start all processes');
          console.log('  [2] Start core processes only');
          console.log('  [3] Launch process management UI');
          console.log('  [4] Show system status');
          console.log('  [q] Quit');
          console.log();
          console.log(chalk.gray('Press a key to select an option...'));
        }
      }
    } catch (error) {
      console.error(chalk.red.bold('Failed to start:'), (error as Error).message);
      if (options.verbose) {
        console.error((error as Error).stack);
      }

      // Cleanup on failure
      console.log(chalk.yellow('Performing cleanup...'));
      try {
        await cleanupOnFailure();
      } catch (cleanupError) {
        console.error(chalk.red('Cleanup failed:'), (cleanupError as Error).message);
      }

      process.exit(1);
    }
  });

}
