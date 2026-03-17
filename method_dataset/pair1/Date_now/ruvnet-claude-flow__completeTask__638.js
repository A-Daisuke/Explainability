function __method_wrapper__() {
  private async completeTask(task: Task, execution: any): Promise<void> {
    const finalResult = {
      success: true,
      executionTime: Date.now() - execution.startTime,
      phases: execution.phaseResults,
      summary: this.createExecutionSummary(execution),
    };

    await this.db.updateTask(task.id, {
      status: 'completed',
      result: JSON.stringify(finalResult),
      progress: 100,
      completed_at: new Date(),
    });

    this.emit('taskCompleted', { task, result: finalResult });
  }

}
