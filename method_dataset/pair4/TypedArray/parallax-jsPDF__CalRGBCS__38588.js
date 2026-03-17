              function CalRGBCS(whitePoint, blackPoint, gamma, matrix) {
                var _this5;

                _classCallCheck(this, CalRGBCS);

                _this5 = _possibleConstructorReturn(
                  this,
                  _getPrototypeOf(CalRGBCS).call(this, "CalRGB", 3)
                );

                if (!whitePoint) {
                  throw new _util.FormatError(
                    "WhitePoint missing - required for color space CalRGB"
                  );
                }

                blackPoint = blackPoint || new Float32Array(3);
                gamma = gamma || new Float32Array([1, 1, 1]);
                matrix =
                  matrix || new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
                var XW = whitePoint[0];
                var YW = whitePoint[1];
                var ZW = whitePoint[2];
                _this5.whitePoint = whitePoint;
                var XB = blackPoint[0];
                var YB = blackPoint[1];
                var ZB = blackPoint[2];
                _this5.blackPoint = blackPoint;
                _this5.GR = gamma[0];
                _this5.GG = gamma[1];
                _this5.GB = gamma[2];
                _this5.MXA = matrix[0];
                _this5.MYA = matrix[1];
                _this5.MZA = matrix[2];
                _this5.MXB = matrix[3];
                _this5.MYB = matrix[4];
                _this5.MZB = matrix[5];
                _this5.MXC = matrix[6];
                _this5.MYC = matrix[7];
                _this5.MZC = matrix[8];

                if (XW < 0 || ZW < 0 || YW !== 1) {
                  throw new _util.FormatError(
                    "Invalid WhitePoint components for ".concat(_this5.name) +
                      ", no fallback available"
                  );
                }

                if (XB < 0 || YB < 0 || ZB < 0) {
                  (0, _util.info)(
                    "Invalid BlackPoint for "
                      .concat(_this5.name, " [")
                      .concat(XB, ", ")
                      .concat(YB, ", ")
                      .concat(ZB, "], ") + "falling back to default."
                  );
                  _this5.blackPoint = new Float32Array(3);
                }

                if (_this5.GR < 0 || _this5.GG < 0 || _this5.GB < 0) {
                  (0, _util.info)(
                    "Invalid Gamma ["
                      .concat(_this5.GR, ", ")
                      .concat(_this5.GG, ", ")
                      .concat(_this5.GB, "] for ") +
                      "".concat(_this5.name, ", falling back to default.")
                  );
                  _this5.GR = _this5.GG = _this5.GB = 1;
                }

                return _this5;
              }
