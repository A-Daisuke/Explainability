function __method_wrapper__() {
  private async analyzePerformance(timeRange: {
    start: Date;
    end: Date;
  }): Promise<AnalyticsInsight[]> {
    const insights: AnalyticsInsight[] = [];

    // Check response time trends
    const responseTimeData = await this.queryMetrics({
      metrics: ['response-time'],
      timeRange,
      aggregation: 'avg',
    });

    if (responseTimeData['response-time']?.length > 0) {
      const values = responseTimeData['response-time'].map((d: any) => d.value);
      const recent = values.slice(-5);
      const earlier = values.slice(0, -5);

      if (recent.length > 0 && earlier.length > 0) {
        const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
        const earlierAvg = earlier.reduce((sum, v) => sum + v, 0) / earlier.length;
        const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;

        if (Math.abs(change) > 20) {
          insights.push({
            id: `perf-insight-${Date.now()}`,
            title: `Response time ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}%`,
            description: `Response time has changed significantly in the recent period`,
            type: 'trend',
            category: 'performance',
            confidence: 80,
            impact: Math.abs(change) > 50 ? 'high' : 'medium',
            priority: Math.abs(change) > 50 ? 'high' : 'medium',
            data: {
              metrics: ['response-time'],
              timeRange,
              values: { recent: recentAvg, earlier: earlierAvg, change },
            },
            recommendations:
              change > 0
                ? [
                    {
                      action: 'Investigate performance degradation',
                      effort: 'medium',
                      impact: 'Restore optimal response times',
                      implementation: [
                        'Check for increased load or traffic',
                        'Review recent code deployments',
                        'Analyze database query performance',
                        'Monitor resource utilization',
                      ],
                    },
                  ]
                : [
                    {
                      action: 'Document performance improvement',
                      effort: 'low',
                      impact: 'Understand what caused the improvement',
                      implementation: [
                        'Identify recent optimizations',
                        'Document best practices',
                        'Monitor sustainability',
                      ],
                    },
                  ],
            status: 'new',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    return insights;
  }

}
