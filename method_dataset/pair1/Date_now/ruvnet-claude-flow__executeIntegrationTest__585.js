function __method_wrapper__() {
  private async executeIntegrationTest(
    test: IntegrationTest, 
    context: VerificationContext
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const result = await test.execute(context);
      result.duration = Date.now() - startTime;
      
      // Cleanup if provided
      if (test.cleanup) {
        try {
          await test.cleanup(context);
        } catch (cleanupError) {
          logger.warn(`Test cleanup failed for '${test.id}':`, cleanupError);
        }
      }
      
      return result;
    } catch (error) {
      return {
        passed: false,
        duration: Date.now() - startTime,
        message: `Test execution failed: ${(error as Error).message}`,
        details: error
      };
    }
  }

}
