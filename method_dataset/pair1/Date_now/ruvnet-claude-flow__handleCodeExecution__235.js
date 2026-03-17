function __method_wrapper__() {
    handleCodeExecution(ws, params, id) {
        const { code, language = 'javascript', timeout = 5000 } = params;
        const startTime = Date.now();

        console.log('🚀 Executing code...');

        try {
            // Create a sandboxed execution context
            const sandbox = {
                console: {
                    log: (...args) => {
                        this.sendToClient(ws, {
                            type: 'execution_output',
                            output: args.join(' ') + '\n'
                        });
                    }
                },
                sendMCPCommand: (cmd, params) => {
                    return new Promise((resolve) => {
                        const cmdId = Date.now();
                        this.sendMCPCommand({
                            jsonrpc: '2.0',
                            method: cmd,
                            params,
                            id: cmdId
                        });

                        // Store callback for response
                        this.messageQueue.push({
                            id: cmdId,
                            ws,
                            callback: (result) => resolve(result)
                        });
                    });
                }
            };

            // Execute code with timeout
            const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            const fn = new AsyncFunction('console', 'sendMCPCommand', code);

            Promise.race([
                fn(sandbox.console, sandbox.sendMCPCommand),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Execution timeout')), timeout)
                )
            ]).then(() => {
                this.sendToClient(ws, {
                    jsonrpc: '2.0',
                    result: {
                        type: 'execution_result',
                        result: {
                            success: true,
                            time: Date.now() - startTime
                        }
                    },
                    id
                });
            }).catch((error) => {
                this.sendToClient(ws, {
                    jsonrpc: '2.0',
                    result: {
                        type: 'execution_result',
                        result: {
                            success: false,
                            error: error.message,
                            time: Date.now() - startTime
                        }
                    },
                    id
                });
            });
        } catch (error) {
            this.sendToClient(ws, {
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: error.message
                },
                id
            });
        }
    }

}
