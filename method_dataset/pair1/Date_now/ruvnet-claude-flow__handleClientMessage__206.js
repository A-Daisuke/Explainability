function __method_wrapper__() {
    handleClientMessage(ws, data) {
        const { method, params, id } = data;

        console.log(`📨 Client Request: ${method}`);

        // Handle code execution directly
        if (method === 'mcp__claude-flow__execute_code') {
            this.handleCodeExecution(ws, params, id);
            return;
        }

        // Forward to real MCP server with proper format
        const mcpCommand = {
            jsonrpc: '2.0',
            method: method.replace('mcp__claude-flow__', ''),
            params: params || {},
            id: id || Date.now()
        };

        // Store the client/request mapping
        this.messageQueue.push({ id: mcpCommand.id, ws, originalId: id });

        // Send to real MCP server
        this.sendMCPCommand(mcpCommand);
    }

}
