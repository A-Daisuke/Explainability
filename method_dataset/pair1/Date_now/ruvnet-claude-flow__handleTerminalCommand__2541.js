  async function handleTerminalCommand(args, state) {
    const subCmd = args[0];
    switch (subCmd) {
      case 'create':
        const name = args[1] || `term-${Date.now()}`;
        const terminal = {
          id: name,
          status: 'active',
          created: new Date().toISOString(),
        };
        state.context.terminals.push(terminal);
        printSuccess(`Created terminal: ${name}`);
        break;

      case 'list':
        if (state.context.terminals.length === 0) {
          console.log('No active terminals');
        } else {
          console.log('Active terminals:');
          state.context.terminals.forEach((term) => {
            console.log(`  ${term.id} - ${term.status}`);
          });
        }
        break;

      case 'exec':
        const cmd = args.slice(1).join(' ');
        if (cmd) {
          console.log(`Executing: ${cmd}`);
          console.log('(Command execution simulated in REPL)');
        } else {
          printError('Usage: terminal exec <command>');
        }
        break;

      case 'attach':
        const attachId = args[1];
        if (attachId) {
          state.currentSession = attachId;
          console.log(`Attached to terminal: ${attachId}`);
          console.log('(Type "terminal detach" to detach)');
        } else {
          printError('Usage: terminal attach <id>');
        }
        break;

      case 'detach':
        if (state.currentSession) {
          console.log(`Detached from terminal: ${state.currentSession}`);
          state.currentSession = null;
        } else {
          console.log('Not attached to any terminal');
        }
        break;

      default:
        console.log('Terminal commands: create, list, exec, attach, detach');
    }
  }
