function __method_wrapper__() {
                      return _regenerator.default.wrap(function _callee2$(
                        _context2
                      ) {
                        while (1) {
                          switch ((_context2.prev = _context2.next)) {
                            case 0:
                              value = obj[prop];

                              if (!(typeof value === "function")) {
                                _context2.next = 3;
                                break;
                              }

                              return _context2.abrupt(
                                "return",
                                value.apply(obj, args)
                              );

                            case 3:
                              return _context2.abrupt("return", value);

                            case 4:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      },

}
