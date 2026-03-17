                        function _callee3$(_context3) {
                          while (1) {
                            switch ((_context3.prev = _context3.next)) {
                              case 0:
                                _context3.prev = 0;
                                value = obj[prop];

                                if (!(typeof value === "function")) {
                                  _context3.next = 4;
                                  break;
                                }

                                return _context3.abrupt(
                                  "return",
                                  value.apply(obj, args)
                                );

                              case 4:
                                return _context3.abrupt("return", value);

                              case 7:
                                _context3.prev = 7;
                                _context3.t0 = _context3["catch"](0);

                                if (
                                  _context3.t0 instanceof
                                  _core_utils.MissingDataException
                                ) {
                                  _context3.next = 11;
                                  break;
                                }

                                throw _context3.t0;

                              case 11:
                                _context3.next = 13;
                                return this.requestRange(
                                  _context3.t0.begin,
                                  _context3.t0.end
                                );

                              case 13:
                                return _context3.abrupt(
                                  "return",
                                  this.ensure(obj, prop, args)
                                );

                              case 14:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        },
