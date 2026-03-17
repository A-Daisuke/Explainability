class __C__ {
  handleConnection(ws, req) {
    const clientId = nanoid();
    const clientInfo = {
      id: clientId,
      ws,
      ip: req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      connectedAt: Date.now(),
      subscriptions: new Set(),
      lastHeartbeat: Date.now(),
    };
    
    this.clients.set(clientId, clientInfo);
    
    console.log(`Truth monitoring client connected: ${clientId}`);
    
    // Send welcome message
    this.sendMessage(ws, {
      type: 'connected',
      payload: {
        client_id: clientId,
        server_time: Date.now(),
        available_events: this.getAvailableEventTypes(),
      },
    });
    
    // Send buffered messages if any
    this.sendBufferedMessages(ws);
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(clientId, message);
      } catch (error) {
        console.error('Invalid message format:', error);
        this.sendError(ws, 'INVALID_MESSAGE_FORMAT', 'Message must be valid JSON');
      }
    });
    
    ws.on('close', () => {
      this.handleDisconnection(clientId);
    });
    
    ws.on('error', (error) => {
      console.error(`Client ${clientId} error:`, error);
      this.handleDisconnection(clientId);
    });
    
    ws.on('pong', () => {
      if (this.clients.has(clientId)) {
        this.clients.get(clientId).lastHeartbeat = Date.now();
      }
    });
    
    this.emit('client_connected', { clientId, clientInfo });
  }

}
