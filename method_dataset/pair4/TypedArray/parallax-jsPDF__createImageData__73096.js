function __method_wrapper__() {
            createImageData: function createImageData() {
              var forceRGBA =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : false;
              var drawWidth = this.drawWidth;
              var drawHeight = this.drawHeight;
              var imgData = {
                width: drawWidth,
                height: drawHeight,
                kind: 0,
                data: null
              };
              var numComps = this.numComps;
              var originalWidth = this.width;
              var originalHeight = this.height;
              var bpc = this.bpc;
              var rowBytes = (originalWidth * numComps * bpc + 7) >> 3;
              var imgArray;

              if (!forceRGBA) {
                var kind;

                if (this.colorSpace.name === "DeviceGray" && bpc === 1) {
                  kind = _util.ImageKind.GRAYSCALE_1BPP;
                } else if (
                  this.colorSpace.name === "DeviceRGB" &&
                  bpc === 8 &&
                  !this.needsDecode
                ) {
                  kind = _util.ImageKind.RGB_24BPP;
                }

                if (
                  kind &&
                  !this.smask &&
                  !this.mask &&
                  drawWidth === originalWidth &&
                  drawHeight === originalHeight
                ) {
                  imgData.kind = kind;
                  imgArray = this.getImageBytes(originalHeight * rowBytes);

                  if (this.image instanceof _stream.DecodeStream) {
                    imgData.data = imgArray;
                  } else {
                    var newArray = new Uint8ClampedArray(imgArray.length);
                    newArray.set(imgArray);
                    imgData.data = newArray;
                  }

                  if (this.needsDecode) {
                    (0, _util.assert)(
                      kind === _util.ImageKind.GRAYSCALE_1BPP,
                      "PDFImage.createImageData: The image must be grayscale."
                    );
                    var buffer = imgData.data;

                    for (var i = 0, ii = buffer.length; i < ii; i++) {
                      buffer[i] ^= 0xff;
                    }
                  }

                  return imgData;
                }

                if (
                  this.image instanceof _jpeg_stream.JpegStream &&
                  !this.smask &&
                  !this.mask
                ) {
                  var imageLength = originalHeight * rowBytes;

                  switch (this.colorSpace.name) {
                    case "DeviceGray":
                      imageLength *= 3;

                    case "DeviceRGB":
                    case "DeviceCMYK":
                      imgData.kind = _util.ImageKind.RGB_24BPP;
                      imgData.data = this.getImageBytes(
                        imageLength,
                        drawWidth,
                        drawHeight,
                        true
                      );
                      return imgData;
                  }
                }
              }

              imgArray = this.getImageBytes(originalHeight * rowBytes);
              var actualHeight =
                0 |
                (((imgArray.length / rowBytes) * drawHeight) / originalHeight);
              var comps = this.getComponents(imgArray);
              var alpha01, maybeUndoPreblend;

              if (!forceRGBA && !this.smask && !this.mask) {
                imgData.kind = _util.ImageKind.RGB_24BPP;
                imgData.data = new Uint8ClampedArray(
                  drawWidth * drawHeight * 3
                );
                alpha01 = 0;
                maybeUndoPreblend = false;
              } else {
                imgData.kind = _util.ImageKind.RGBA_32BPP;
                imgData.data = new Uint8ClampedArray(
                  drawWidth * drawHeight * 4
                );
                alpha01 = 1;
                maybeUndoPreblend = true;
                this.fillOpacity(
                  imgData.data,
                  drawWidth,
                  drawHeight,
                  actualHeight,
                  comps
                );
              }

              if (this.needsDecode) {
                this.decodeBuffer(comps);
              }

              this.colorSpace.fillRgb(
                imgData.data,
                originalWidth,
                originalHeight,
                drawWidth,
                drawHeight,
                actualHeight,
                bpc,
                comps,
                alpha01
              );

              if (maybeUndoPreblend) {
                this.undoPreblend(imgData.data, drawWidth, actualHeight);
              }

              return imgData;
            },

}
