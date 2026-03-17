            function _loadDocument() {
              _loadDocument = _asyncToGenerator(
                /*#__PURE__*/
                _regenerator.default.mark(function _callee(recoveryMode) {
                  var _ref6, _ref7, numPages, fingerprint;

                  return _regenerator.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch ((_context.prev = _context.next)) {
                        case 0:
                          _context.next = 2;
                          return pdfManager.ensureDoc("checkHeader");

                        case 2:
                          _context.next = 4;
                          return pdfManager.ensureDoc("parseStartXRef");

                        case 4:
                          _context.next = 6;
                          return pdfManager.ensureDoc("parse", [recoveryMode]);

                        case 6:
                          if (recoveryMode) {
                            _context.next = 9;
                            break;
                          }

                          _context.next = 9;
                          return pdfManager.ensureDoc("checkFirstPage");

                        case 9:
                          _context.next = 11;
                          return Promise.all([
                            pdfManager.ensureDoc("numPages"),
                            pdfManager.ensureDoc("fingerprint")
                          ]);

                        case 11:
                          _ref6 = _context.sent;
                          _ref7 = _slicedToArray(_ref6, 2);
                          numPages = _ref7[0];
                          fingerprint = _ref7[1];
                          return _context.abrupt("return", {
                            numPages: numPages,
                            fingerprint: fingerprint
                          });

                        case 16:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                })
              );
              return _loadDocument.apply(this, arguments);
            }
