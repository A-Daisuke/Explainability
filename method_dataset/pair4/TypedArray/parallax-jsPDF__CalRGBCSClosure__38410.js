        var CalRGBCS = (function CalRGBCSClosure() {
          var BRADFORD_SCALE_MATRIX = new Float32Array([
            0.8951,
            0.2664,
            -0.1614,
            -0.7502,
            1.7135,
            0.0367,
            0.0389,
            -0.0685,
            1.0296
          ]);
          var BRADFORD_SCALE_INVERSE_MATRIX = new Float32Array([
            0.9869929,
            -0.1470543,
            0.1599627,
            0.4323053,
            0.5183603,
            0.0492912,
            -0.0085287,
            0.0400428,
            0.9684867
          ]);
          var SRGB_D65_XYZ_TO_RGB_MATRIX = new Float32Array([
            3.2404542,
            -1.5371385,
            -0.4985314,
            -0.969266,
            1.8760108,
            0.041556,
            0.0556434,
            -0.2040259,
            1.0572252
          ]);
          var FLAT_WHITEPOINT_MATRIX = new Float32Array([1, 1, 1]);
          var tempNormalizeMatrix = new Float32Array(3);
          var tempConvertMatrix1 = new Float32Array(3);
          var tempConvertMatrix2 = new Float32Array(3);
          var DECODE_L_CONSTANT = Math.pow((8 + 16) / 116, 3) / 8.0;

          function matrixProduct(a, b, result) {
            result[0] = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
            result[1] = a[3] * b[0] + a[4] * b[1] + a[5] * b[2];
            result[2] = a[6] * b[0] + a[7] * b[1] + a[8] * b[2];
          }

          function convertToFlat(sourceWhitePoint, LMS, result) {
            result[0] = (LMS[0] * 1) / sourceWhitePoint[0];
            result[1] = (LMS[1] * 1) / sourceWhitePoint[1];
            result[2] = (LMS[2] * 1) / sourceWhitePoint[2];
          }

          function convertToD65(sourceWhitePoint, LMS, result) {
            var D65X = 0.95047;
            var D65Y = 1;
            var D65Z = 1.08883;
            result[0] = (LMS[0] * D65X) / sourceWhitePoint[0];
            result[1] = (LMS[1] * D65Y) / sourceWhitePoint[1];
            result[2] = (LMS[2] * D65Z) / sourceWhitePoint[2];
          }

          function sRGBTransferFunction(color) {
            if (color <= 0.0031308) {
              return adjustToRange(0, 1, 12.92 * color);
            }

            return adjustToRange(
              0,
              1,
              (1 + 0.055) * Math.pow(color, 1 / 2.4) - 0.055
            );
          }

          function adjustToRange(min, max, value) {
            return Math.max(min, Math.min(max, value));
          }

          function decodeL(L) {
            if (L < 0) {
              return -decodeL(-L);
            }

            if (L > 8.0) {
              return Math.pow((L + 16) / 116, 3);
            }

            return L * DECODE_L_CONSTANT;
          }

          function compensateBlackPoint(sourceBlackPoint, XYZ_Flat, result) {
            if (
              sourceBlackPoint[0] === 0 &&
              sourceBlackPoint[1] === 0 &&
              sourceBlackPoint[2] === 0
            ) {
              result[0] = XYZ_Flat[0];
              result[1] = XYZ_Flat[1];
              result[2] = XYZ_Flat[2];
              return;
            }

            var zeroDecodeL = decodeL(0);
            var X_DST = zeroDecodeL;
            var X_SRC = decodeL(sourceBlackPoint[0]);
            var Y_DST = zeroDecodeL;
            var Y_SRC = decodeL(sourceBlackPoint[1]);
            var Z_DST = zeroDecodeL;
            var Z_SRC = decodeL(sourceBlackPoint[2]);
            var X_Scale = (1 - X_DST) / (1 - X_SRC);
            var X_Offset = 1 - X_Scale;
            var Y_Scale = (1 - Y_DST) / (1 - Y_SRC);
            var Y_Offset = 1 - Y_Scale;
            var Z_Scale = (1 - Z_DST) / (1 - Z_SRC);
            var Z_Offset = 1 - Z_Scale;
            result[0] = XYZ_Flat[0] * X_Scale + X_Offset;
            result[1] = XYZ_Flat[1] * Y_Scale + Y_Offset;
            result[2] = XYZ_Flat[2] * Z_Scale + Z_Offset;
          }

          function normalizeWhitePointToFlat(sourceWhitePoint, XYZ_In, result) {
            if (sourceWhitePoint[0] === 1 && sourceWhitePoint[2] === 1) {
              result[0] = XYZ_In[0];
              result[1] = XYZ_In[1];
              result[2] = XYZ_In[2];
              return;
            }

            var LMS = result;
            matrixProduct(BRADFORD_SCALE_MATRIX, XYZ_In, LMS);
            var LMS_Flat = tempNormalizeMatrix;
            convertToFlat(sourceWhitePoint, LMS, LMS_Flat);
            matrixProduct(BRADFORD_SCALE_INVERSE_MATRIX, LMS_Flat, result);
          }

          function normalizeWhitePointToD65(sourceWhitePoint, XYZ_In, result) {
            var LMS = result;
            matrixProduct(BRADFORD_SCALE_MATRIX, XYZ_In, LMS);
            var LMS_D65 = tempNormalizeMatrix;
            convertToD65(sourceWhitePoint, LMS, LMS_D65);
            matrixProduct(BRADFORD_SCALE_INVERSE_MATRIX, LMS_D65, result);
          }

          function convertToRgb(cs, src, srcOffset, dest, destOffset, scale) {
            var A = adjustToRange(0, 1, src[srcOffset] * scale);
            var B = adjustToRange(0, 1, src[srcOffset + 1] * scale);
            var C = adjustToRange(0, 1, src[srcOffset + 2] * scale);
            var AGR = Math.pow(A, cs.GR);
            var BGG = Math.pow(B, cs.GG);
            var CGB = Math.pow(C, cs.GB);
            var X = cs.MXA * AGR + cs.MXB * BGG + cs.MXC * CGB;
            var Y = cs.MYA * AGR + cs.MYB * BGG + cs.MYC * CGB;
            var Z = cs.MZA * AGR + cs.MZB * BGG + cs.MZC * CGB;
            var XYZ = tempConvertMatrix1;
            XYZ[0] = X;
            XYZ[1] = Y;
            XYZ[2] = Z;
            var XYZ_Flat = tempConvertMatrix2;
            normalizeWhitePointToFlat(cs.whitePoint, XYZ, XYZ_Flat);
            var XYZ_Black = tempConvertMatrix1;
            compensateBlackPoint(cs.blackPoint, XYZ_Flat, XYZ_Black);
            var XYZ_D65 = tempConvertMatrix2;
            normalizeWhitePointToD65(
              FLAT_WHITEPOINT_MATRIX,
              XYZ_Black,
              XYZ_D65
            );
            var SRGB = tempConvertMatrix1;
            matrixProduct(SRGB_D65_XYZ_TO_RGB_MATRIX, XYZ_D65, SRGB);
            dest[destOffset] = sRGBTransferFunction(SRGB[0]) * 255;
            dest[destOffset + 1] = sRGBTransferFunction(SRGB[1]) * 255;
            dest[destOffset + 2] = sRGBTransferFunction(SRGB[2]) * 255;
          }

          var CalRGBCS =
            /*#__PURE__*/
            (function(_ColorSpace8) {
              _inherits(CalRGBCS, _ColorSpace8);

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

              _createClass(CalRGBCS, [
                {
                  key: "getRgbItem",
                  value: function getRgbItem(src, srcOffset, dest, destOffset) {
                    convertToRgb(this, src, srcOffset, dest, destOffset, 1);
                  }
                },
                {
                  key: "getRgbBuffer",
                  value: function getRgbBuffer(
                    src,
                    srcOffset,
                    count,
                    dest,
                    destOffset,
                    bits,
                    alpha01
                  ) {
                    var scale = 1 / ((1 << bits) - 1);

                    for (var i = 0; i < count; ++i) {
                      convertToRgb(
                        this,
                        src,
                        srcOffset,
                        dest,
                        destOffset,
                        scale
                      );
                      srcOffset += 3;
                      destOffset += 3 + alpha01;
                    }
                  }
                },
                {
                  key: "getOutputLength",
                  value: function getOutputLength(inputLength, alpha01) {
                    return ((inputLength * (3 + alpha01)) / 3) | 0;
                  }
                }
              ]);

              return CalRGBCS;
            })(ColorSpace);

          return CalRGBCS;
        })();
