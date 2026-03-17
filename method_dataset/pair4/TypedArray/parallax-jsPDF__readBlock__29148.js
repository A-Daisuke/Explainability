function __method_wrapper__() {
          JpegStream.prototype.readBlock = function() {
            if (this.eof) {
              return;
            }

            var jpegOptions = {
              decodeTransform: undefined,
              colorTransform: undefined
            };
            var decodeArr = this.dict.getArray("Decode", "D");

            if (this.forceRGB && Array.isArray(decodeArr)) {
              var bitsPerComponent = this.dict.get("BitsPerComponent") || 8;
              var decodeArrLength = decodeArr.length;
              var transform = new Int32Array(decodeArrLength);
              var transformNeeded = false;
              var maxValue = (1 << bitsPerComponent) - 1;

              for (var i = 0; i < decodeArrLength; i += 2) {
                transform[i] = ((decodeArr[i + 1] - decodeArr[i]) * 256) | 0;
                transform[i + 1] = (decodeArr[i] * maxValue) | 0;

                if (transform[i] !== 256 || transform[i + 1] !== 0) {
                  transformNeeded = true;
                }
              }

              if (transformNeeded) {
                jpegOptions.decodeTransform = transform;
              }
            }

            if ((0, _primitives.isDict)(this.params)) {
              var colorTransform = this.params.get("ColorTransform");

              if (Number.isInteger(colorTransform)) {
                jpegOptions.colorTransform = colorTransform;
              }
            }

            var jpegImage = new _jpg.JpegImage(jpegOptions);
            jpegImage.parse(this.bytes);
            var data = jpegImage.getData({
              width: this.drawWidth,
              height: this.drawHeight,
              forceRGB: this.forceRGB,
              isSourcePDF: true
            });
            this.buffer = data;
            this.bufferLength = data.length;
            this.eof = true;
          };

}
