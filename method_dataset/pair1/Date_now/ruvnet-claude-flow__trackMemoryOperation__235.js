export async function trackMemoryOperation(operationType, mode, duration, success = true, errorType = null) {
  // Update session activity
  metricsCache.performance.lastActivity = Date.now();
  metricsCache.performance.sessionDuration = Date.now() - metricsCache.performance.startTime;

  // Track mode usage
  if (mode === 'reasoningbank') {
    metricsCache.performance.memoryMode.reasoningbankOperations++;
  } else if (mode === 'basic') {
    metricsCache.performance.memoryMode.basicOperations++;
  }

  // Track operation type
  if (metricsCache.performance.operations[operationType]) {
    const op = metricsCache.performance.operations[operationType];
    op.count++;
    op.totalDuration += duration;

    if (!success) {
      op.errors++;
    }
  }

  // Update performance statistics
  const perf = metricsCache.performance.performance;
  perf.totalOperationTime += duration;

  const totalOps = Object.values(metricsCache.performance.operations)
    .reduce((sum, op) => sum + op.count, 0);

  if (totalOps > 0) {
    perf.avgOperationDuration = perf.totalOperationTime / totalOps;
  }

  if (perf.minOperationDuration === null || duration < perf.minOperationDuration) {
    perf.minOperationDuration = duration;
  }

  if (perf.maxOperationDuration === null || duration > perf.maxOperationDuration) {
    perf.maxOperationDuration = duration;
  }

  if (duration > 5000) {
    perf.slowOperations++;
  } else if (duration < 100) {
    perf.fastOperations++;
  }

  // Track errors
  if (!success && errorType) {
    metricsCache.performance.errors.total++;

    // Track by type
    if (!metricsCache.performance.errors.byType[errorType]) {
      metricsCache.performance.errors.byType[errorType] = 0;
    }
    metricsCache.performance.errors.byType[errorType]++;

    // Track by operation
    if (!metricsCache.performance.errors.byOperation[operationType]) {
      metricsCache.performance.errors.byOperation[operationType] = 0;
    }
    metricsCache.performance.errors.byOperation[operationType]++;

    // Add to recent errors (keep last 20)
    metricsCache.performance.errors.recent.push({
      operation: operationType,
      type: errorType,
      timestamp: Date.now(),
      mode
    });

    if (metricsCache.performance.errors.recent.length > 20) {
      metricsCache.performance.errors.recent = metricsCache.performance.errors.recent.slice(-20);
    }
  }

  await saveMetricsToDisk();
}
