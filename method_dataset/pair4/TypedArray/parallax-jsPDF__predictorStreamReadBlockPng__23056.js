function __method_wrapper__() {
          PredictorStream.prototype.readBlockPng = function predictorStreamReadBlockPng() {
            var rowBytes = this.rowBytes;
            var pixBytes = this.pixBytes;
            var predictor = this.str.getByte();
            var rawBytes = this.str.getBytes(rowBytes);
            this.eof = !rawBytes.length;

            if (this.eof) {
              return;
            }

            var bufferLength = this.bufferLength;
            var buffer = this.ensureBuffer(bufferLength + rowBytes);
            var prevRow = buffer.subarray(
              bufferLength - rowBytes,
              bufferLength
            );

            if (prevRow.length === 0) {
              prevRow = new Uint8Array(rowBytes);
            }

            var i,
              j = bufferLength,
              up,
              c;

            switch (predictor) {
              case 0:
                for (i = 0; i < rowBytes; ++i) {
                  buffer[j++] = rawBytes[i];
                }

                break;

              case 1:
                for (i = 0; i < pixBytes; ++i) {
                  buffer[j++] = rawBytes[i];
                }

                for (; i < rowBytes; ++i) {
                  buffer[j] = (buffer[j - pixBytes] + rawBytes[i]) & 0xff;
                  j++;
                }

                break;

              case 2:
                for (i = 0; i < rowBytes; ++i) {
                  buffer[j++] = (prevRow[i] + rawBytes[i]) & 0xff;
                }

                break;

              case 3:
                for (i = 0; i < pixBytes; ++i) {
                  buffer[j++] = (prevRow[i] >> 1) + rawBytes[i];
                }

                for (; i < rowBytes; ++i) {
                  buffer[j] =
                    (((prevRow[i] + buffer[j - pixBytes]) >> 1) + rawBytes[i]) &
                    0xff;
                  j++;
                }

                break;

              case 4:
                for (i = 0; i < pixBytes; ++i) {
                  up = prevRow[i];
                  c = rawBytes[i];
                  buffer[j++] = up + c;
                }

                for (; i < rowBytes; ++i) {
                  up = prevRow[i];
                  var upLeft = prevRow[i - pixBytes];
                  var left = buffer[j - pixBytes];
                  var p = left + up - upLeft;
                  var pa = p - left;

                  if (pa < 0) {
                    pa = -pa;
                  }

                  var pb = p - up;

                  if (pb < 0) {
                    pb = -pb;
                  }

                  var pc = p - upLeft;

                  if (pc < 0) {
                    pc = -pc;
                  }

                  c = rawBytes[i];

                  if (pa <= pb && pa <= pc) {
                    buffer[j++] = left + c;
                  } else if (pb <= pc) {
                    buffer[j++] = up + c;
                  } else {
                    buffer[j++] = upLeft + c;
                  }
                }

                break;

              default:
                throw new _util.FormatError(
                  "Unsupported predictor: ".concat(predictor)
                );
            }

            this.bufferLength += rowBytes;
          };

}
