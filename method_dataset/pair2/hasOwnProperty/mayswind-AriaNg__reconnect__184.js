        var reconnect = function (context) {
            if (!context || !socketClient) {
                return;
            }

            for (var uniqueId in sendIdStates) {
                if (!sendIdStates.hasOwnProperty(uniqueId)) {
                    continue;
                }

                var state = sendIdStates[uniqueId];

                if (!state) {
                    delete sendIdStates[uniqueId];
                    continue;
                }

                state.deferred.reject({
                    success: false,
                    context: state.context
                });

                ariaNgLogService.debug('[aria2WebSocketRpcService.reconnect] reject old request', state.context);
                state.context.errorCallback(state.context.id, { message: 'Cannot connect to aria2!' });

                delete sendIdStates[uniqueId];
            }

            if (context.connectionReconnectingCallback) {
                context.connectionReconnectingCallback({
                    rpcUrl: rpcUrl
                });
            }

            socketClient.reconnect();
        };
