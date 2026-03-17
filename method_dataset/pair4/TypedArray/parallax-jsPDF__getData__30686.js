function __method_wrapper__() {
            getData: function getData(_ref3) {
              var width = _ref3.width,
                height = _ref3.height,
                _ref3$forceRGB = _ref3.forceRGB,
                forceRGB = _ref3$forceRGB === void 0 ? false : _ref3$forceRGB,
                _ref3$isSourcePDF = _ref3.isSourcePDF,
                isSourcePDF =
                  _ref3$isSourcePDF === void 0 ? false : _ref3$isSourcePDF;

              if (this.numComponents > 4) {
                throw new JpegError("Unsupported color mode");
              }

              var data = this._getLinearizedBlockData(
                width,
                height,
                isSourcePDF
              );

              if (this.numComponents === 1 && forceRGB) {
                var dataLength = data.length;
                var rgbData = new Uint8ClampedArray(dataLength * 3);
                var offset = 0;

                for (var i = 0; i < dataLength; i++) {
                  var grayColor = data[i];
                  rgbData[offset++] = grayColor;
                  rgbData[offset++] = grayColor;
                  rgbData[offset++] = grayColor;
                }

                return rgbData;
              } else if (
                this.numComponents === 3 &&
                this._isColorConversionNeeded
              ) {
                return this._convertYccToRgb(data);
              } else if (this.numComponents === 4) {
                if (this._isColorConversionNeeded) {
                  if (forceRGB) {
                    return this._convertYcckToRgb(data);
                  }

                  return this._convertYcckToCmyk(data);
                } else if (forceRGB) {
                  return this._convertCmykToRgb(data);
                }
              }

              return data;
            }

}
