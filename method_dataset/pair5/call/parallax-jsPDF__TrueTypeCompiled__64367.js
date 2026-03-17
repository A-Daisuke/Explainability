              function TrueTypeCompiled(glyphs, cmap, fontMatrix) {
                var _this;

                _classCallCheck(this, TrueTypeCompiled);

                _this = _possibleConstructorReturn(
                  this,
                  _getPrototypeOf(TrueTypeCompiled).call(
                    this,
                    fontMatrix || [0.000488, 0, 0, 0.000488, 0, 0]
                  )
                );
                _this.glyphs = glyphs;
                _this.cmap = cmap;
                return _this;
              }
