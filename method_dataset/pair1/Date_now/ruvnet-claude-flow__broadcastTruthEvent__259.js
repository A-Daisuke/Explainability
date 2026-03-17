function __method_wrapper__() {
  broadcastTruthEvent(event) {
    const truthEvent = {
      id: nanoid(),
      type: event.type || 'truth_change',
      timestamp: Date.now(),
      data: event.data,
      severity: event.severity || 'medium',
      source: event.source,
      confidence: event.confidence,
      metadata: event.metadata || {},
    };
    
    // Add to message buffer
    this.addToBuffer(truthEvent);
    
    // Find matching subscriptions
    const matchingSubscriptions = Array.from(this.subscriptions.values())
      .filter(sub => this.eventMatchesFilter(truthEvent, sub.filter));
    
    // Send to subscribed clients
    matchingSubscriptions.forEach(subscription => {
      const client = this.clients.get(subscription.clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        this.sendMessage(client.ws, {
          type: 'truth_event',
          payload: truthEvent,
        });
      }
    });
    
    this.emit('truth_event_broadcast', { event: truthEvent, subscribers: matchingSubscriptions.length });
  }

}
