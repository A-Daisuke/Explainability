function __method_wrapper__() {
  handleGetStatus(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    const status = {
      server_uptime: Date.now() - this.startTime,
      connected_clients: this.clients.size,
      active_subscriptions: this.subscriptions.size,
      message_buffer_size: this.messageBuffer.length,
      server_time: Date.now(),
    };
    
    this.sendMessage(client.ws, {
      type: 'status_response',
      payload: status,
      id: message.id,
    });
  }

}
