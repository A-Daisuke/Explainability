class __C__ {
  emit(eventType, data) {
    const timestamp = Date.now();

    // Add to event history
    this.eventHistory.push({
      type: eventType,
      data,
      timestamp,
    });

    // Trim history if too large
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify subscribers
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.forEach((callback) => {
        try {
          callback(data, timestamp);
        } catch (error) {
          console.error(`Error in event subscriber for ${eventType}:`, error);
        }
      });
    }
  }

}
