function __method_wrapper__() {
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`Received command from client: ${data.type}`);

        if (data.type === 'command') {
          handleCliCommand(data.data, ws);
        } else if (data.type === 'ping') {
          // Handle ping/pong for connection keepalive
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
      } catch (error) {
        console.error('Failed to handle WebSocket message:', error);
        ws.send(
          JSON.stringify({
            type: 'error',
            data: `Invalid message format: ${error instanceof Error ? error.message : String(error)}`,
            timestamp: new Date().toISOString(),
          }),
        );
      }
    });

}
