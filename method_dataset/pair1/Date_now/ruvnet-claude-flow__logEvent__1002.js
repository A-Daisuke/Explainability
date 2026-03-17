function logEvent(eventData) {
  const event = {
    id: nanoid(),
    timestamp: Date.now(),
    severity: 'MEDIUM',
    ...eventData,
  };
  
  dataStore.events.push(event);
  
  // Keep only last 1000 events
  if (dataStore.events.length > 1000) {
    dataStore.events = dataStore.events.slice(-1000);
  }
}
