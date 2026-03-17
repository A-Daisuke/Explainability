class __C__ {
  handleSubscribe(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    const { payload } = message;
    const subscriptionId = nanoid();
    
    const subscription = {
      id: subscriptionId,
      clientId,
      filter: this.validateSubscriptionFilter(payload.filter),
      createdAt: Date.now(),
    };
    
    this.subscriptions.set(subscriptionId, subscription);
    client.subscriptions.add(subscriptionId);
    
    this.sendMessage(client.ws, {
      type: 'subscription_created',
      payload: {
        subscription_id: subscriptionId,
        filter: subscription.filter,
      },
      id: message.id,
    });
    
    console.log(`Client ${clientId} subscribed with filter:`, subscription.filter);
  }

}
