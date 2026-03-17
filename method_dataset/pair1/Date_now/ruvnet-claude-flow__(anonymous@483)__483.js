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
