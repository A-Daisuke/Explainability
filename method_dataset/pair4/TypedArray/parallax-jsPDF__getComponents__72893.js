function __method_wrapper__() {
            getComponents: function getComponents(buffer) {
              var bpc = this.bpc;

              if (bpc === 8) {
                return buffer;
              }

              var width = this.width;
              var height = this.height;
              var numComps = this.numComps;
              var length = width * height * numComps;
              var bufferPos = 0;
              var output =
                bpc <= 8
                  ? new Uint8Array(length)
                  : bpc <= 16
                  ? new Uint16Array(length)
                  : new Uint32Array(length);
              var rowComps = width * numComps;
              var max = (1 << bpc) - 1;
              var i = 0,
                ii,
                buf;

              if (bpc === 1) {
                var mask, loop1End, loop2End;

                for (var j = 0; j < height; j++) {
                  loop1End = i + (rowComps & ~7);
                  loop2End = i + rowComps;

                  while (i < loop1End) {
                    buf = buffer[bufferPos++];
                    output[i] = (buf >> 7) & 1;
                    output[i + 1] = (buf >> 6) & 1;
                    output[i + 2] = (buf >> 5) & 1;
                    output[i + 3] = (buf >> 4) & 1;
                    output[i + 4] = (buf >> 3) & 1;
                    output[i + 5] = (buf >> 2) & 1;
                    output[i + 6] = (buf >> 1) & 1;
                    output[i + 7] = buf & 1;
                    i += 8;
                  }

                  if (i < loop2End) {
                    buf = buffer[bufferPos++];
                    mask = 128;

                    while (i < loop2End) {
                      output[i++] = +!!(buf & mask);
                      mask >>= 1;
                    }
                  }
                }
              } else {
                var bits = 0;
                buf = 0;

                for (i = 0, ii = length; i < ii; ++i) {
                  if (i % rowComps === 0) {
                    buf = 0;
                    bits = 0;
                  }

                  while (bits < bpc) {
                    buf = (buf << 8) | buffer[bufferPos++];
                    bits += 8;
                  }

                  var remainingBits = bits - bpc;
                  var value = buf >> remainingBits;
                  output[i] = value < 0 ? 0 : value > max ? max : value;
                  buf = buf & ((1 << remainingBits) - 1);
                  bits = remainingBits;
                }
              }

              return output;
            },

}
