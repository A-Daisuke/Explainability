class __C__ {
  async performAutoSave() {
    if (this.pendingChanges.length === 0) {
      return;
    }

    try {
      // Group changes by type
      const changesByType = this.pendingChanges.reduce((acc, change) => {
        if (!acc[change.type]) {
          acc[change.type] = [];
        }
        acc[change.type].push(change);
        return acc;
      }, {});

      // Calculate progress
      const taskProgress = changesByType.task_progress || [];
      const completedTasks = taskProgress.filter((t) => t.data.status === 'completed').length;
      const totalTasks = taskProgress.length;
      const completionPercentage =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Create checkpoint data
      const checkpointData = {
        timestamp: new Date().toISOString(),
        changeCount: this.pendingChanges.length,
        changesByType,
        statistics: {
          tasksProcessed: taskProgress.length,
          tasksCompleted: completedTasks,
          memoryUpdates: (changesByType.memory_update || []).length,
          agentActivities: (changesByType.agent_activity || []).length,
          consensusDecisions: (changesByType.consensus_reached || []).length,
        },
      };

      // Save checkpoint
      const checkpointName = `auto-save-${Date.now()}`;
      await this.sessionManager.saveCheckpoint(this.sessionId, checkpointName, checkpointData);

      // Update session progress
      if (completionPercentage > 0) {
        await this.sessionManager.updateSessionProgress(this.sessionId, completionPercentage);
      }

      // Log all changes as session events
      for (const change of this.pendingChanges) {
        this.sessionManager.logSessionEvent(
          this.sessionId,
          'info',
          `Auto-save: ${change.type}`,
          change.data.agentId || null,
          change.data,
        );
      }

      // Clear pending changes
      this.pendingChanges = [];
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Keep changes for next attempt
    }
  }

}
