      const checkReady = () => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed > timeout) {
          reject(new Error(`Agent ${agent.id} failed to become ready within ${timeout}ms`));
          return;
        }

        // Check if process is still running
        if (agent.process.killed || agent.process.exitCode !== null) {
          reject(new Error(`Agent ${agent.id} process terminated during initialization`));
          return;
        }

        // For now, assume agent is ready after a short delay
        // In a real implementation, you might check for specific output or response
        if (elapsed > 2000) { // 2 seconds
          resolve();
        } else {
          setTimeout(checkReady, checkInterval);
        }
      };
