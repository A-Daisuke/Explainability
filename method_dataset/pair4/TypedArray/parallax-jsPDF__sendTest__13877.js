                          var sendTest = function sendTest() {
                            var testObj = new Uint8Array([
                              _this6.postMessageTransfers ? 255 : 0
                            ]);

                            try {
                              messageHandler.send("test", testObj, [
                                testObj.buffer
                              ]);
                            } catch (ex) {
                              (0, _util.info)(
                                "Cannot use postMessage transfers"
                              );
                              testObj[0] = 0;
                              messageHandler.send("test", testObj);
                            }
                          };
