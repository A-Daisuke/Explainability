class __C__ {
  calculateServerMetrics() {
    const now = Date.now();
    const clients = Array.from(this.clients.values());
    
    return {
      server_uptime: now - (this.startTime || now),
      connected_clients: clients.length,
      active_subscriptions: this.subscriptions.size,
      message_buffer_size: this.messageBuffer.length,
      client_stats: {
        newest_connection: Math.min(...clients.map(c => now - c.connectedAt)),
        oldest_connection: Math.max(...clients.map(c => now - c.connectedAt)),
        average_connection_age: clients.length > 0 
          ? clients.reduce((sum, c) => sum + (now - c.connectedAt), 0) / clients.length 
          : 0,
      },
      subscription_stats: {
        subscriptions_per_client: this.subscriptions.size / Math.max(clients.length, 1),
        most_popular_event_types: this.getMostPopularEventTypes(),
      },
      performance: {
        memory_usage: process.memoryUsage(),
        cpu_usage: process.cpuUsage(),
      },
    };
  }

}
