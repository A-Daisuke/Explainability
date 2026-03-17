                        function _callee2$(_context2) {
                          while (1) {
                            switch ((_context2.prev = _context2.next)) {
                              case 0:
                                _context2.next = 2;
                                return this._readCapability.promise;

                              case 2:
                                if (!this._done) {
                                  _context2.next = 4;
                                  break;
                                }

                                return _context2.abrupt("return", {
                                  value: undefined,
                                  done: true
                                });

                              case 4:
                                if (!this._storedError) {
                                  _context2.next = 6;
                                  break;
                                }

                                throw this._storedError;

                              case 6:
                                chunk = this._readableStream.read();

                                if (!(chunk === null)) {
                                  _context2.next = 10;
                                  break;
                                }

                                this._readCapability = (0,
                                _util.createPromiseCapability)();
                                return _context2.abrupt("return", this.read());

                              case 10:
                                this._loaded += chunk.length;

                                if (this.onProgress) {
                                  this.onProgress({
                                    loaded: this._loaded
                                  });
                                }

                                buffer = new Uint8Array(chunk).buffer;
                                return _context2.abrupt("return", {
                                  value: buffer,
                                  done: false
                                });

                              case 14:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        },
