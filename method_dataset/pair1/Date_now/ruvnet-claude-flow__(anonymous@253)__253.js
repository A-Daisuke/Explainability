function __method_wrapper__() {
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
