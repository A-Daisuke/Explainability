function extractResponsePatterns(
  request: LLMHookPayload['request'],
  response: LLMHookPayload['response'],
  metrics: LLMMetrics
): Pattern[] {
  const patterns: Pattern[] = [];
  
  // Extract performance patterns
  if (metrics.latency > 1000) {
    patterns.push({
      id: `perf_${Date.now()}`,
      type: 'optimization',
      confidence: 0.8,
      occurrences: 1,
      context: {
        provider: metrics.providerHealth < 0.8 ? 'unhealthy' : 'healthy',
        requestSize: JSON.stringify(request).length,
        responseTokens: response?.usage?.totalTokens || 0,
        latency: metrics.latency,
      },
    });
  }
  
  // Extract success patterns
  if (response?.choices?.[0]?.finishReason === 'stop') {
    patterns.push({
      id: `success_${Date.now()}`,
      type: 'success',
      confidence: 0.9,
      occurrences: 1,
      context: {
        temperature: request.temperature,
        maxTokens: request.maxTokens,
        actualTokens: response.usage?.totalTokens || 0,
      },
    });
  }
  
  return patterns;
}
