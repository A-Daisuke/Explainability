              function CalGrayCS(whitePoint, blackPoint, gamma) {
                var _this4;

                _classCallCheck(this, CalGrayCS);

                _this4 = _possibleConstructorReturn(
                  this,
                  _getPrototypeOf(CalGrayCS).call(this, "CalGray", 1)
                );

                if (!whitePoint) {
                  throw new _util.FormatError(
                    "WhitePoint missing - required for color space CalGray"
                  );
                }

                blackPoint = blackPoint || [0, 0, 0];
                gamma = gamma || 1;
                _this4.XW = whitePoint[0];
                _this4.YW = whitePoint[1];
                _this4.ZW = whitePoint[2];
                _this4.XB = blackPoint[0];
                _this4.YB = blackPoint[1];
                _this4.ZB = blackPoint[2];
                _this4.G = gamma;

                if (_this4.XW < 0 || _this4.ZW < 0 || _this4.YW !== 1) {
                  throw new _util.FormatError(
                    "Invalid WhitePoint components for ".concat(_this4.name) +
                      ", no fallback available"
                  );
                }

                if (_this4.XB < 0 || _this4.YB < 0 || _this4.ZB < 0) {
                  (0, _util.info)(
                    "Invalid BlackPoint for ".concat(
                      _this4.name,
                      ", falling back to default."
                    )
                  );
                  _this4.XB = _this4.YB = _this4.ZB = 0;
                }

                if (_this4.XB !== 0 || _this4.YB !== 0 || _this4.ZB !== 0) {
                  (0, _util.warn)(
                    ""
                      .concat(_this4.name, ", BlackPoint: XB: ")
                      .concat(_this4.XB, ", YB: ")
                      .concat(_this4.YB, ", ") +
                      "ZB: ".concat(
                        _this4.ZB,
                        ", only default values are supported."
                      )
                  );
                }

                if (_this4.G < 1) {
                  (0, _util.info)(
                    "Invalid Gamma: "
                      .concat(_this4.G, " for ")
                      .concat(_this4.name, ", ") + "falling back to default."
                  );
                  _this4.G = 1;
                }

                return _this4;
              }
