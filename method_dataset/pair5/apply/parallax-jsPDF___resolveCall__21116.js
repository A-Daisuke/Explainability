        function _resolveCall() {
          _resolveCall = _asyncToGenerator(
            /*#__PURE__*/
            _regenerator.default.mark(function _callee(fn, args) {
              var thisArg,
                _args = arguments;
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      thisArg =
                        _args.length > 2 && _args[2] !== undefined
                          ? _args[2]
                          : null;

                      if (fn) {
                        _context.next = 3;
                        break;
                      }

                      return _context.abrupt("return");

                    case 3:
                      return _context.abrupt("return", fn.apply(thisArg, args));

                    case 4:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            })
          );
          return _resolveCall.apply(this, arguments);
        }
