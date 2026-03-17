export function createSessionWithProperTimezone(objective, options = {}) {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Store both UTC timestamp (for consistency) and timezone info
  const utcTimestamp = new Date().toISOString();
  const localTimestamp = getLocalTimestamp();
  const timezoneInfo = getTimezoneInfo();

  const session = {
    id: sessionId,
    objective,
    createdAt: utcTimestamp,
    createdAtLocal: localTimestamp,
    timezone: timezoneInfo,
    status: 'active',
    ...options,
  };

  return session;
}
