export async function trackTaskExecution(taskId, taskType, success, duration, metadata = {}) {
  const task = {
    id: taskId,
    type: taskType,
    success,
    duration,
    timestamp: Date.now(),
    metadata
  };
  
  metricsCache.tasks.push(task);
  metricsCache.performance.totalTasks++;
  
  if (success) {
    metricsCache.performance.successfulTasks++;
  } else {
    metricsCache.performance.failedTasks++;
  }
  
  // Keep only last 1000 tasks
  if (metricsCache.tasks.length > 1000) {
    metricsCache.tasks = metricsCache.tasks.slice(-1000);
  }
  
  await saveMetricsToDisk();
}
