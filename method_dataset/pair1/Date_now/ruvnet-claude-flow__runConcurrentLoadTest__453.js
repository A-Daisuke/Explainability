function __method_wrapper__() {
  async runConcurrentLoadTest(
    concurrentUsers: number,
    requestsPerUser: number,
    durationSeconds: number
  ): Promise<{
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    throughput: number;
    errorDistribution: Map<string, number>;
  }> {
    console.log(`Starting load test: ${concurrentUsers} users, ${requestsPerUser} requests each, ${durationSeconds}s duration`);

    const startTime = Date.now();
    const endTime = startTime + (durationSeconds * 1000);
    const results: any[] = [];
    const errorDistribution = new Map<string, number>();

    // Register test agents
    const testAgents = Array.from({ length: concurrentUsers }, (_, i) => `load-test-agent-${i}`);
    for (const agentId of testAgents) {
      try {
        await this.security.registerAgent(agentId, ['verify'], 'MEDIUM');
      } catch (error) {
        // Agent might already exist
      }
    }

    // Create concurrent user simulations
    const userPromises = testAgents.map(async (agentId, userIndex) => {
      const userResults: any[] = [];
      let requestCount = 0;

      while (Date.now() < endTime && requestCount < requestsPerUser) {
        const requestStart = Date.now();
        
        try {
          const request = SecurityTestUtils.createMockVerificationRequest({ agentId });
          await this.security.processVerificationRequest(request);
          
          const responseTime = Date.now() - requestStart;
          userResults.push({
            success: true,
            responseTime,
            timestamp: new Date()
          });
        } catch (error) {
          const responseTime = Date.now() - requestStart;
          userResults.push({
            success: false,
            responseTime,
            error: error.message,
            timestamp: new Date()
          });

          // Track error distribution
          const errorType = error.message.split(':')[0] || 'Unknown';
          errorDistribution.set(errorType, (errorDistribution.get(errorType) || 0) + 1);
        }
        
        requestCount++;
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      return userResults;
    });

    // Wait for all users to complete
    const allUserResults = await Promise.all(userPromises);
    
    // Aggregate results
    const allResults = allUserResults.flat();
    const totalRequests = allResults.length;
    const successfulRequests = allResults.filter(r => r.success).length;
    const failedRequests = totalRequests - successfulRequests;
    
    const responseTimes = allResults.map(r => r.responseTime);
    const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    
    const actualDuration = (Date.now() - startTime) / 1000;
    const throughput = totalRequests / actualDuration;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime,
      throughput,
      errorDistribution
    };
  }

}
