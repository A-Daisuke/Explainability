            function IndexedCS(base, highVal, lookup) {
              var _this3;

              _classCallCheck(this, IndexedCS);

              _this3 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(IndexedCS).call(this, "Indexed", 1)
              );
              _this3.base = base;
              _this3.highVal = highVal;
              var baseNumComps = base.numComps;
              var length = baseNumComps * highVal;

              if ((0, _primitives.isStream)(lookup)) {
                _this3.lookup = new Uint8Array(length);
                var bytes = lookup.getBytes(length);

                _this3.lookup.set(bytes);
              } else if ((0, _util.isString)(lookup)) {
                _this3.lookup = new Uint8Array(length);

                for (var i = 0; i < length; ++i) {
                  _this3.lookup[i] = lookup.charCodeAt(i);
                }
              } else if (lookup instanceof Uint8Array) {
                _this3.lookup = lookup;
              } else {
                throw new _util.FormatError(
                  "Unrecognized lookup table: ".concat(lookup)
                );
              }

              return _this3;
            }
