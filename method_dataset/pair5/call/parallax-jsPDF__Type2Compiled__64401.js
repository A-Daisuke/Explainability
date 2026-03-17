              function Type2Compiled(cffInfo, cmap, fontMatrix, glyphNameMap) {
                var _this2;

                _classCallCheck(this, Type2Compiled);

                _this2 = _possibleConstructorReturn(
                  this,
                  _getPrototypeOf(Type2Compiled).call(
                    this,
                    fontMatrix || [0.001, 0, 0, 0.001, 0, 0]
                  )
                );
                _this2.glyphs = cffInfo.glyphs;
                _this2.gsubrs = cffInfo.gsubrs || [];
                _this2.subrs = cffInfo.subrs || [];
                _this2.cmap = cmap;
                _this2.glyphNameMap =
                  glyphNameMap || (0, _glyphlist.getGlyphsUnicode)();
                _this2.gsubrsBias =
                  _this2.gsubrs.length < 1240
                    ? 107
                    : _this2.gsubrs.length < 33900
                    ? 1131
                    : 32768;
                _this2.subrsBias =
                  _this2.subrs.length < 1240
                    ? 107
                    : _this2.subrs.length < 33900
                    ? 1131
                    : 32768;
                _this2.isCFFCIDFont = cffInfo.isCFFCIDFont;
                _this2.fdSelect = cffInfo.fdSelect;
                _this2.fdArray = cffInfo.fdArray;
                return _this2;
              }
