class __C__ {
  async _findBestWorkerAsync(task) {
    const availableWorkers = Array.from(this.state.workers.values()).filter(
      (w) => w.status === 'idle',
    );

    if (availableWorkers.length === 0) {
      return null;
    }

    // Use cached analysis if available
    const cacheKey = `worker_match_${task.description.substring(0, 50)}`;
    const cachedMatch = await this.mcpWrapper.retrieveMemory(this.state.swarmId, cacheKey);

    if (cachedMatch && cachedMatch.timestamp > Date.now() - 300000) {
      // 5 min cache
      const cachedWorker = availableWorkers.find((w) => w.type === cachedMatch.workerType);
      if (cachedWorker) return cachedWorker;
    }

    // Enhanced matching algorithm with performance scoring
    const taskLower = task.description.toLowerCase();
    const taskWords = taskLower.split(/\s+/);

    // Enhanced priority mapping with weights
    const priorityMap = {
      researcher: {
        keywords: ['research', 'investigate', 'analyze', 'study', 'explore'],
        weight: 1.2,
      },
      coder: {
        keywords: ['code', 'implement', 'build', 'develop', 'fix', 'create', 'program'],
        weight: 1.0,
      },
      analyst: {
        keywords: ['analyze', 'data', 'metrics', 'performance', 'report', 'statistics'],
        weight: 1.1,
      },
      tester: { keywords: ['test', 'validate', 'check', 'verify', 'quality', 'qa'], weight: 1.0 },
      architect: {
        keywords: ['design', 'architecture', 'structure', 'plan', 'system'],
        weight: 1.3,
      },
      reviewer: { keywords: ['review', 'feedback', 'improve', 'refactor', 'audit'], weight: 1.0 },
      optimizer: {
        keywords: ['optimize', 'performance', 'speed', 'efficiency', 'enhance'],
        weight: 1.4,
      },
      documenter: { keywords: ['document', 'explain', 'write', 'describe', 'manual'], weight: 0.9 },
    };

    // Calculate scores for each worker
    const workerScores = availableWorkers.map((worker) => {
      const typeInfo = priorityMap[worker.type] || { keywords: [], weight: 1.0 };

      // Keyword matching score
      const keywordScore = typeInfo.keywords.reduce((score, keyword) => {
        return score + (taskWords.includes(keyword) ? 1 : 0);
      }, 0);

      // Performance history score
      const performanceScore = worker.performance
        ? worker.performance.successRate * 0.5 + (1 / (worker.performance.avgTaskTime + 1)) * 0.5
        : 0.5;

      // Task completion rate
      const completionScore =
        worker.tasksCompleted > 0 ? Math.min(worker.tasksCompleted / 10, 1) : 0;

      // Combined score
      const totalScore =
        (keywordScore * 2 + // Keyword relevance
          performanceScore * 1.5 + // Historical performance
          completionScore * 1.0) * // Experience
        typeInfo.weight;

      return {
        worker,
        score: totalScore,
        breakdown: {
          keyword: keywordScore,
          performance: performanceScore,
          completion: completionScore,
          weight: typeInfo.weight,
        },
      };
    });

    // Sort by score and select best
    workerScores.sort((a, b) => b.score - a.score);
    const bestMatch = workerScores[0];

    // Cache the result for future use
    if (bestMatch.score > 0) {
      setImmediate(async () => {
        await this.mcpWrapper.storeMemory(
          this.state.swarmId,
          cacheKey,
          {
            workerType: bestMatch.worker.type,
            score: bestMatch.score,
            timestamp: Date.now(),
          },
          'cache',
        );
      });
    }

    return bestMatch ? bestMatch.worker : availableWorkers[0];
  }

}
