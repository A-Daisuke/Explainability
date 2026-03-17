function calculateDetailedMetrics(timeframe) {
  const basic = calculateMetrics();
  const timeframePeriods = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
  };
  
  const period = timeframePeriods[timeframe] || timeframePeriods['24h'];
  const cutoff = Date.now() - period;
  
  // Filter events by timeframe
  const recentEvents = verificationStore.events.filter(e => e.timestamp >= cutoff);
  
  return {
    ...basic,
    timeframe,
    period_ms: period,
    recent_events_count: recentEvents.length,
    trends: calculateTrends(recentEvents),
    error_distribution: calculateErrorDistribution(recentEvents),
  };
}
