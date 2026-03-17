function __method_wrapper__() {
          PDFImage.createMask = function(_ref5) {
            var imgArray = _ref5.imgArray,
              width = _ref5.width,
              height = _ref5.height,
              imageIsFromDecodeStream = _ref5.imageIsFromDecodeStream,
              inverseDecode = _ref5.inverseDecode;
            var computedLength = ((width + 7) >> 3) * height;
            var actualLength = imgArray.byteLength;
            var haveFullData = computedLength === actualLength;
            var data, i;

            if (imageIsFromDecodeStream && (!inverseDecode || haveFullData)) {
              data = imgArray;
            } else if (!inverseDecode) {
              data = new Uint8ClampedArray(actualLength);
              data.set(imgArray);
            } else {
              data = new Uint8ClampedArray(computedLength);
              data.set(imgArray);

              for (i = actualLength; i < computedLength; i++) {
                data[i] = 0xff;
              }
            }

            if (inverseDecode) {
              for (i = 0; i < actualLength; i++) {
                data[i] ^= 0xff;
              }
            }

            return {
              data: data,
              width: width,
              height: height
            };
          };

}
