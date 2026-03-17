function generateTimeSeries(verifications, timeframe) {
  // Generate mock time series data
  const points = [];
  const now = Date.now();
  const intervals = {
    ONE_HOUR: 12, // 5-minute intervals
    TWENTY_FOUR_HOURS: 24, // 1-hour intervals
    SEVEN_DAYS: 7, // 1-day intervals
    THIRTY_DAYS: 30, // 1-day intervals
  };
  
  const intervalCount = intervals[timeframe] || 24;
  const intervalSize = {
    ONE_HOUR: 5 * 60 * 1000,
    TWENTY_FOUR_HOURS: 60 * 60 * 1000,
    SEVEN_DAYS: 24 * 60 * 60 * 1000,
    THIRTY_DAYS: 24 * 60 * 60 * 1000,
  }[timeframe] || 60 * 60 * 1000;
  
  for (let i = 0; i < intervalCount; i++) {
    const timestamp = now - (intervalCount - i - 1) * intervalSize;
    points.push({
      timestamp,
      value: Math.random() * 100 + 50,
      metric: 'verification_count',
    });
  }
  
  return points;
}
