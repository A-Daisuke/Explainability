class __C__ {
  async createObjective(description) {
    try {
      this.log(`Creating objective: ${description}`);

      // Execute swarm command
      const args = ['swarm', description, '--ui', '--monitor'];
      const process = spawn('claude-flow', args, {
        detached: true,
        stdio: 'ignore',
      });

      process.unref();

      // Track the process for later termination
      const processId = `swarm-${Date.now()}`;
      this.activeProcesses.set(processId, process);

      this.log(`Launched swarm with PID: ${process.pid} (ID: ${processId})`);

      // Update data after a delay
      setTimeout(() => {
        this.updateSwarmData();
      }, 2000);
    } catch (error) {
      this.log(`Error creating objective: ${error.message}`, 'error');
    }
  }

}
