function __method_wrapper__() {
  async getSwarmStatus(params = {}) {
    try {
      // Don't reinitialize if we already have storage
      if (!this.memoryDb && !this.memoryStore) {
        await this.initializeMemoryStorage();
      }

      const swarms = [];
      let activeAgents = 0;
      let totalTasks = 0;
      let completedTasks = 0;

      if (this.memoryDb) {
        // Get all unique swarm namespaces
        const namespacesQuery = this.memoryDb.prepare(`
          SELECT DISTINCT namespace FROM memories 
          WHERE namespace LIKE 'swarm-%' OR namespace LIKE 'hive-%'
          ORDER BY timestamp DESC
        `);
        const namespaces = namespacesQuery.all();

        // For each swarm, gather its information
        for (const { namespace } of namespaces) {
          const swarmId = namespace;
          
          // Get swarm metadata
          const metadataQuery = this.memoryDb.prepare(`
            SELECT key, value, type, timestamp FROM memories 
            WHERE namespace = ? AND (
              key IN ('init_performance', 'config', 'status', 'agents', 'tasks', 'topology')
              OR key LIKE 'agent-%'
              OR key LIKE 'task-%'
            )
          `);
          const swarmData = metadataQuery.all(swarmId);

          // Parse swarm information
          let swarmInfo = {
            id: swarmId,
            name: swarmId,
            status: 'unknown',
            agents: 0,
            tasks: { total: 0, completed: 0, pending: 0, failed: 0 },
            topology: 'hierarchical',
            createdAt: null,
            lastActivity: null,
            memoryUsage: swarmData.length
          };

          // Process swarm data
          for (const record of swarmData) {
            try {
              const value = typeof record.value === 'string' ? JSON.parse(record.value) : record.value;
              
              switch (record.key) {
                case 'init_performance':
                  swarmInfo.createdAt = value.timestamp;
                  swarmInfo.topology = value.topology || 'hierarchical';
                  break;
                case 'status':
                  swarmInfo.status = value;
                  break;
                case 'config':
                  swarmInfo.topology = value.topology || swarmInfo.topology;
                  break;
              }

              // Count agents
              if (record.key.startsWith('agent-')) {
                swarmInfo.agents++;
                activeAgents++;
              }

              // Count tasks
              if (record.key.startsWith('task-')) {
                swarmInfo.tasks.total++;
                totalTasks++;
                if (value.status === 'completed') {
                  swarmInfo.tasks.completed++;
                  completedTasks++;
                } else if (value.status === 'failed') {
                  swarmInfo.tasks.failed++;
                } else if (value.status === 'pending' || value.status === 'in_progress') {
                  swarmInfo.tasks.pending++;
                }
              }

              // Track last activity
              if (record.timestamp > (swarmInfo.lastActivity || 0)) {
                swarmInfo.lastActivity = record.timestamp;
              }
            } catch (e) {
              // Skip invalid JSON values
            }
          }

          // Determine swarm status based on activity
          if (swarmInfo.status === 'unknown') {
            const now = Date.now();
            const lastActivityAge = now - (swarmInfo.lastActivity || 0);
            
            if (lastActivityAge < 60000) { // Active within last minute
              swarmInfo.status = 'active';
            } else if (lastActivityAge < 300000) { // Active within last 5 minutes
              swarmInfo.status = 'idle';
            } else {
              swarmInfo.status = 'inactive';
            }
          }

          swarms.push(swarmInfo);
        }

        // Get recent activity logs
        const activityQuery = this.memoryDb.prepare(`
          SELECT namespace, key, type, timestamp FROM memories 
          WHERE (namespace LIKE 'swarm-%' OR namespace LIKE 'hive-%')
          AND timestamp > ?
          ORDER BY timestamp DESC
          LIMIT 10
        `);
        const recentActivity = activityQuery.all(Date.now() - 300000); // Last 5 minutes

        return {
          swarms,
          activeAgents,
          totalTasks,
          completedTasks,
          pendingTasks: totalTasks - completedTasks,
          recentActivity: recentActivity.map(r => ({
            swarmId: r.namespace,
            action: r.key,
            type: r.type,
            timestamp: r.timestamp
          })),
          summary: {
            totalSwarms: swarms.length,
            activeSwarms: swarms.filter(s => s.status === 'active').length,
            idleSwarms: swarms.filter(s => s.status === 'idle').length,
            inactiveSwarms: swarms.filter(s => s.status === 'inactive').length
          }
        };
      } else {
        // Fallback to in-memory storage
        const swarmMap = new Map();
        
        for (const [key, memory] of this.memoryStore) {
          const namespace = memory.namespace;
          if (namespace && (namespace.startsWith('swarm-') || namespace.startsWith('hive-'))) {
            if (!swarmMap.has(namespace)) {
              swarmMap.set(namespace, {
                id: namespace,
                name: namespace,
                status: 'active',
                agents: 0,
                tasks: { total: 0, completed: 0, pending: 0, failed: 0 },
                memoryUsage: 0
              });
            }
            
            const swarm = swarmMap.get(namespace);
            swarm.memoryUsage++;
            
            if (memory.key.startsWith('agent-')) {
              swarm.agents++;
              activeAgents++;
            }
            
            if (memory.key.startsWith('task-')) {
              swarm.tasks.total++;
              totalTasks++;
              try {
                const taskData = JSON.parse(memory.value);
                if (taskData.status === 'completed') {
                  swarm.tasks.completed++;
                  completedTasks++;
                } else if (taskData.status === 'failed') {
                  swarm.tasks.failed++;
                } else if (taskData.status === 'pending' || taskData.status === 'in_progress') {
                  swarm.tasks.pending++;
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
        
        return {
          swarms: Array.from(swarmMap.values()),
          activeAgents,
          totalTasks,
          completedTasks,
          pendingTasks: totalTasks - completedTasks,
          summary: {
            totalSwarms: swarmMap.size,
            activeSwarms: swarmMap.size
          }
        };
      }
    } catch (error) {
      console.error('Error getting swarm status:', error);
      // Return empty status on error
      return {
        swarms: [],
        activeAgents: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        recentActivity: [],
        summary: {
          totalSwarms: 0,
          activeSwarms: 0,
          idleSwarms: 0,
          inactiveSwarms: 0
        },
        error: error.message
      };
    }
  }

}
