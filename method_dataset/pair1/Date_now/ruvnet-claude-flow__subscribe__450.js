const __obj__ = {
      subscribe: async function* (parent, args, context) {
        const severityFilter = args.severity || ['HIGH', 'CRITICAL'];
        
        while (true) {
          // Generate mock system alerts
          if (Math.random() < 0.1) { // 10% chance per iteration
            const alert = {
              id: nanoid(),
              type: 'SYSTEM',
              severity: severityFilter[Math.floor(Math.random() * severityFilter.length)],
              message: 'System alert generated',
              timestamp: Date.now(),
              data: { source: 'monitoring' },
              acknowledged: false,
            };
            
            yield { systemAlerts: alert };
          }
          
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      },

};
