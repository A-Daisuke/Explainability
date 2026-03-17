function __method_wrapper__() {
  async getUsageMetrics(timeRange?: { start: Date; end: Date }): Promise<UsageMetrics> {
    const range = timeRange || {
      start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      end: new Date(),
    };

    const usageData = await this.queryMetrics({
      metrics: ['active-users', 'sessions', 'api-calls', 'feature-usage'],
      timeRange: range,
      aggregation: 'sum',
    });

    return {
      users: {
        total: 10000,
        active: this.getLatestValue(usageData['active-users']) || 0,
        new: 50,
        returning: 1500,
        churn: 25,
      },
      sessions: {
        total: this.getLatestValue(usageData['sessions']) || 0,
        duration: {
          avg: 15 * 60, // 15 minutes
          median: 12 * 60,
        },
        bounceRate: 25,
        pagesPerSession: 4.5,
      },
      features: {
        adoption: {
          dashboard: { users: 800, usage: 5000, retention: 85 },
          reports: { users: 600, usage: 2000, retention: 70 },
          analytics: { users: 400, usage: 1500, retention: 60 },
        },
        mostUsed: ['dashboard', 'reports', 'search'],
        leastUsed: ['advanced-filters', 'export', 'integrations'],
      },
      api: {
        calls: this.getLatestValue(usageData['api-calls']) || 0,
        uniqueConsumers: 150,
        avgResponseTime: 250,
        errorRate: 2.5,
        rateLimits: {
          hit: 5,
          consumed: 75,
        },
      },
      content: {
        created: 100,
        modified: 250,
        deleted: 25,
        views: 5000,
      },
    };
  }

}
