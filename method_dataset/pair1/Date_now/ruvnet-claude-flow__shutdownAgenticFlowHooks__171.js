export async function shutdownAgenticFlowHooks(): Promise<void> {
  logger.info('Shutting down agentic-flow hook system...');
  
  try {
    // Wait for active executions to complete
    const maxWaitTime = 10000; // 10 seconds
    const startTime = Date.now();
    
    while (agenticHookManager.getMetrics()['executions.active'] > 0) {
      if (Date.now() - startTime > maxWaitTime) {
        logger.warn('Timeout waiting for active executions to complete');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Remove all listeners
    agenticHookManager.removeAllListeners();
    
    logger.info('Agentic-flow hook system shut down successfully');
  } catch (error) {
    logger.error('Error during hook system shutdown:', error);
    throw error;
  }
}
