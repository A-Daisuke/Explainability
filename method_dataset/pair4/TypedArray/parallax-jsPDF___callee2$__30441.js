                        function _callee2$(_context2) {
                          while (1) {
                            switch ((_context2.prev = _context2.next)) {
                              case 0:
                                _context2.next = 2;
                                return this._readCapability.promise;

                              case 2:
                                _context2.next = 4;
                                return this._reader.read();

                              case 4:
                                _ref2 = _context2.sent;
                                value = _ref2.value;
                                done = _ref2.done;

                                if (!done) {
                                  _context2.next = 9;
                                  break;
                                }

                                return _context2.abrupt("return", {
                                  value: value,
                                  done: done
                                });

                              case 9:
                                this._loaded += value.byteLength;

                                if (this.onProgress) {
                                  this.onProgress({
                                    loaded: this._loaded
                                  });
                                }

                                buffer = new Uint8Array(value).buffer;
                                return _context2.abrupt("return", {
                                  value: buffer,
                                  done: false
                                });

                              case 13:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        },
