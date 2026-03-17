function __method_wrapper__() {
            _getLinearizedBlockData: function _getLinearizedBlockData(
              width,
              height
            ) {
              var isSourcePDF =
                arguments.length > 2 && arguments[2] !== undefined
                  ? arguments[2]
                  : false;
              var scaleX = this.width / width,
                scaleY = this.height / height;
              var component,
                componentScaleX,
                componentScaleY,
                blocksPerScanline;
              var x, y, i, j, k;
              var index;
              var offset = 0;
              var output;
              var numComponents = this.components.length;
              var dataLength = width * height * numComponents;
              var data = new Uint8ClampedArray(dataLength);
              var xScaleBlockOffset = new Uint32Array(width);
              var mask3LSB = 0xfffffff8;

              for (i = 0; i < numComponents; i++) {
                component = this.components[i];
                componentScaleX = component.scaleX * scaleX;
                componentScaleY = component.scaleY * scaleY;
                offset = i;
                output = component.output;
                blocksPerScanline = (component.blocksPerLine + 1) << 3;

                for (x = 0; x < width; x++) {
                  j = 0 | (x * componentScaleX);
                  xScaleBlockOffset[x] = ((j & mask3LSB) << 3) | (j & 7);
                }

                for (y = 0; y < height; y++) {
                  j = 0 | (y * componentScaleY);
                  index = (blocksPerScanline * (j & mask3LSB)) | ((j & 7) << 3);

                  for (x = 0; x < width; x++) {
                    data[offset] = output[index + xScaleBlockOffset[x]];
                    offset += numComponents;
                  }
                }
              }

              var transform = this._decodeTransform;

              if (!isSourcePDF && numComponents === 4 && !transform) {
                transform = new Int32Array([
                  -256,
                  255,
                  -256,
                  255,
                  -256,
                  255,
                  -256,
                  255
                ]);
              }

              if (transform) {
                for (i = 0; i < dataLength; ) {
                  for (j = 0, k = 0; j < numComponents; j++, i++, k += 2) {
                    data[i] =
                      ((data[i] * transform[k]) >> 8) + transform[k + 1];
                  }
                }
              }

              return data;
            },

}
