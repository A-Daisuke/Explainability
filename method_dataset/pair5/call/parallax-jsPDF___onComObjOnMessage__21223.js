function __method_wrapper__() {
          this._onComObjOnMessage = function(event) {
            var data = event.data;

            if (data.targetName !== _this.sourceName) {
              return;
            }

            if (data.stream) {
              _this._processStreamMessage(data);
            } else if (data.isReply) {
              var callbackId = data.callbackId;

              if (data.callbackId in callbacksCapabilities) {
                var callback = callbacksCapabilities[callbackId];
                delete callbacksCapabilities[callbackId];

                if ("error" in data) {
                  callback.reject(wrapReason(data.error));
                } else {
                  callback.resolve(data.data);
                }
              } else {
                throw new Error("Cannot resolve callback ".concat(callbackId));
              }
            } else if (data.action in ah) {
              var action = ah[data.action];

              if (data.callbackId) {
                var _sourceName = _this.sourceName;
                var _targetName = data.sourceName;
                Promise.resolve()
                  .then(function() {
                    return action[0].call(action[1], data.data);
                  })
                  .then(
                    function(result) {
                      comObj.postMessage({
                        sourceName: _sourceName,
                        targetName: _targetName,
                        isReply: true,
                        callbackId: data.callbackId,
                        data: result
                      });
                    },
                    function(reason) {
                      comObj.postMessage({
                        sourceName: _sourceName,
                        targetName: _targetName,
                        isReply: true,
                        callbackId: data.callbackId,
                        error: makeReasonSerializable(reason)
                      });
                    }
                  );
              } else if (data.streamId) {
                _this._createStreamSink(data);
              } else {
                action[0].call(action[1], data.data);
              }
            } else {
              throw new Error(
                "Unknown action from worker: ".concat(data.action)
              );
            }
          };

}
