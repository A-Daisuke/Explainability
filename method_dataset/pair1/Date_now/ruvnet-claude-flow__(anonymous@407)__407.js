function __method_wrapper__() {
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      
      // Check for stale connections
      this.clients.forEach((client, clientId) => {
        const timeSinceLastHeartbeat = now - client.lastHeartbeat;
        
        if (timeSinceLastHeartbeat > this.heartbeatInterval * 2) {
          // Client is stale, close connection
          console.log(`Closing stale connection: ${clientId}`);
          client.ws.terminate();
          this.handleDisconnection(clientId);
        } else {
          // Send ping
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.ping();
          }
        }
      });
    }, this.heartbeatInterval);

}
