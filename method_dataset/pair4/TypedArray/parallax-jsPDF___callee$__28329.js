                        function _callee$(_context) {
                          while (1) {
                            switch ((_context.prev = _context.next)) {
                              case 0:
                                _context.next = 2;
                                return this._readCapability.promise;

                              case 2:
                                if (!this._done) {
                                  _context.next = 4;
                                  break;
                                }

                                return _context.abrupt("return", {
                                  value: undefined,
                                  done: true
                                });

                              case 4:
                                if (!this._storedError) {
                                  _context.next = 6;
                                  break;
                                }

                                throw this._storedError;

                              case 6:
                                chunk = this._readableStream.read();

                                if (!(chunk === null)) {
                                  _context.next = 10;
                                  break;
                                }

                                this._readCapability = (0,
                                _util.createPromiseCapability)();
                                return _context.abrupt("return", this.read());

                              case 10:
                                this._loaded += chunk.length;

                                if (this.onProgress) {
                                  this.onProgress({
                                    loaded: this._loaded,
                                    total: this._contentLength
                                  });
                                }

                                buffer = new Uint8Array(chunk).buffer;
                                return _context.abrupt("return", {
                                  value: buffer,
                                  done: false
                                });

                              case 14:
                              case "end":
                                return _context.stop();
                            }
                          }
                        },
