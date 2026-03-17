              function GenericFontLoader(docId) {
                var _this2;

                _classCallCheck(this, GenericFontLoader);

                _this2 = _possibleConstructorReturn(
                  this,
                  _getPrototypeOf(GenericFontLoader).call(this, docId)
                );
                _this2.loadingContext = {
                  requests: [],
                  nextRequestId: 0
                };
                _this2.loadTestFontId = 0;
                return _this2;
              }
