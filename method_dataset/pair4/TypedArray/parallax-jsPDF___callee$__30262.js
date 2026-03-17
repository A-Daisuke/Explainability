                        function _callee$(_context) {
                          while (1) {
                            switch ((_context.prev = _context.next)) {
                              case 0:
                                _context.next = 2;
                                return this._headersCapability.promise;

                              case 2:
                                _context.next = 4;
                                return this._reader.read();

                              case 4:
                                _ref = _context.sent;
                                value = _ref.value;
                                done = _ref.done;

                                if (!done) {
                                  _context.next = 9;
                                  break;
                                }

                                return _context.abrupt("return", {
                                  value: value,
                                  done: done
                                });

                              case 9:
                                this._loaded += value.byteLength;

                                if (this.onProgress) {
                                  this.onProgress({
                                    loaded: this._loaded,
                                    total: this._contentLength
                                  });
                                }

                                buffer = new Uint8Array(value).buffer;
                                return _context.abrupt("return", {
                                  value: buffer,
                                  done: false
                                });

                              case 13:
                              case "end":
                                return _context.stop();
                            }
                          }
                        },
