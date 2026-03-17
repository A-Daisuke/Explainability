function __method_wrapper__() {
  private async executeTask(task: Task, plan: ExecutionPlan): Promise<void> {
    const execution = {
      taskId: task.id,
      plan,
      startTime: Date.now(),
      currentPhase: 0,
      phaseResults: [],
      status: 'executing',
    };

    this.activeExecutions.set(task.id, execution);

    try {
      // Execute phases according to strategy
      if (plan.parallelizable) {
        await this.executeParallel(task, plan, execution);
      } else {
        await this.executeSequential(task, plan, execution);
      }

      // Mark task as completed
      execution.status = 'completed';
      await this.completeTask(task, execution);
    } catch (error) {
      execution.status = 'failed';
      execution.error = error;
      await this.handleTaskFailure(task, execution, error);
    } finally {
      this.activeExecutions.delete(task.id);
    }
  }

}
