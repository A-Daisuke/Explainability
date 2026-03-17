              function LabCS(whitePoint, blackPoint, range) {
                var _this6;

                _classCallCheck(this, LabCS);

                _this6 = _possibleConstructorReturn(
                  this,
                  _getPrototypeOf(LabCS).call(this, "Lab", 3)
                );

                if (!whitePoint) {
                  throw new _util.FormatError(
                    "WhitePoint missing - required for color space Lab"
                  );
                }

                blackPoint = blackPoint || [0, 0, 0];
                range = range || [-100, 100, -100, 100];
                _this6.XW = whitePoint[0];
                _this6.YW = whitePoint[1];
                _this6.ZW = whitePoint[2];
                _this6.amin = range[0];
                _this6.amax = range[1];
                _this6.bmin = range[2];
                _this6.bmax = range[3];
                _this6.XB = blackPoint[0];
                _this6.YB = blackPoint[1];
                _this6.ZB = blackPoint[2];

                if (_this6.XW < 0 || _this6.ZW < 0 || _this6.YW !== 1) {
                  throw new _util.FormatError(
                    "Invalid WhitePoint components, no fallback available"
                  );
                }

                if (_this6.XB < 0 || _this6.YB < 0 || _this6.ZB < 0) {
                  (0, _util.info)(
                    "Invalid BlackPoint, falling back to default"
                  );
                  _this6.XB = _this6.YB = _this6.ZB = 0;
                }

                if (_this6.amin > _this6.amax || _this6.bmin > _this6.bmax) {
                  (0, _util.info)("Invalid Range, falling back to defaults");
                  _this6.amin = -100;
                  _this6.amax = 100;
                  _this6.bmin = -100;
                  _this6.bmax = 100;
                }

                return _this6;
              }
