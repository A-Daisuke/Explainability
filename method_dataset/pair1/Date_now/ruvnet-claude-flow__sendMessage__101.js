function __method_wrapper__() {
  sendMessage(message: Omit<HiveMessage, 'id' | 'timestamp'>): HiveMessage {
    const fullMessage: HiveMessage = {
      ...message,
      id: generateId('msg'),
      timestamp: Date.now(),
    };

    // Route message based on type
    this.routeMessage(fullMessage);

    // Store in appropriate channel
    const channelType = this.getChannelTypeForMessage(fullMessage.type);
    const channel = Array.from(this.channels.values()).find((c) => c.type === channelType);
    if (channel) {
      channel.messages.push(fullMessage);
    }

    // Queue for recipient(s)
    if (fullMessage.to === 'broadcast') {
      // Queue for all agents
      for (const channel of this.channels.values()) {
        for (const member of channel.members) {
          this.queueMessage(member, fullMessage);
        }
      }
    } else {
      // Queue for specific recipient
      this.queueMessage(fullMessage.to, fullMessage);
    }

    this.emit('message:sent', fullMessage);

    return fullMessage;
  }

}
