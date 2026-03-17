function __method_wrapper__() {
  async executePipeline(
    pipelineId: string,
    initialPayload: HookPayload,
    context: AgenticHookContext
  ): Promise<HookHandlerResult[]> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline '${pipelineId}' not found`);
    }
    
    const startTime = Date.now();
    const results: HookHandlerResult[] = [];
    let currentPayload = initialPayload;
    
    try {
      for (const stage of pipeline.stages) {
        // Check stage condition
        if (stage.condition && !stage.condition(context)) {
          logger.debug(`Skipping stage '${stage.name}' due to condition`);
          continue;
        }
        
        // Execute stage hooks
        const stageResults = await this.executeStage(
          stage, 
          currentPayload, 
          context
        );
        
        // Apply stage transform if provided
        if (stage.transform) {
          for (let i = 0; i < stageResults.length; i++) {
            stageResults[i] = stage.transform(stageResults[i]);
          }
        }
        
        results.push(...stageResults);
        
        // Update payload for next stage
        const lastModified = stageResults
          .reverse()
          .find(r => r.modified && r.payload);
        if (lastModified) {
          currentPayload = lastModified.payload;
        }
      }
      
      // Update pipeline metrics
      this.updatePipelineMetrics(pipeline, Date.now() - startTime, false);
      
      return results;
    } catch (error) {
      // Update error metrics
      this.updatePipelineMetrics(pipeline, Date.now() - startTime, true);
      
      // Handle error based on strategy
      if (pipeline.errorStrategy === 'rollback') {
        await this.rollbackPipeline(pipeline, results, context);
      }
      
      throw error;
    }
  }

}
