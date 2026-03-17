function __method_wrapper__() {
  private async wrapTask(agentType: string, taskName: string, promise: Promise<any>): Promise<ParallelTaskResult> {
    const startTime = Date.now();
    
    try {
      const result = await promise;
      const endTime = Date.now();
      
      const taskResult: ParallelTaskResult = {
        agentType,
        taskName,
        startTime,
        endTime,
        duration: endTime - startTime,
        result,
        status: 'success'
      };
      
      this.results.push(taskResult);
      return taskResult;
    } catch (error) {
      const endTime = Date.now();
      
      const taskResult: ParallelTaskResult = {
        agentType,
        taskName,
        startTime,
        endTime,
        duration: endTime - startTime,
        result: null,
        status: 'error',
        error
      };
      
      this.results.push(taskResult);
      return taskResult;
    }
  }

}
