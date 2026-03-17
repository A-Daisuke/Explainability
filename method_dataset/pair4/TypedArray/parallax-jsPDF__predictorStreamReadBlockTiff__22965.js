function __method_wrapper__() {
          PredictorStream.prototype.readBlockTiff = function predictorStreamReadBlockTiff() {
            var rowBytes = this.rowBytes;
            var bufferLength = this.bufferLength;
            var buffer = this.ensureBuffer(bufferLength + rowBytes);
            var bits = this.bits;
            var colors = this.colors;
            var rawBytes = this.str.getBytes(rowBytes);
            this.eof = !rawBytes.length;

            if (this.eof) {
              return;
            }

            var inbuf = 0,
              outbuf = 0;
            var inbits = 0,
              outbits = 0;
            var pos = bufferLength;
            var i;

            if (bits === 1 && colors === 1) {
              for (i = 0; i < rowBytes; ++i) {
                var c = rawBytes[i] ^ inbuf;
                c ^= c >> 1;
                c ^= c >> 2;
                c ^= c >> 4;
                inbuf = (c & 1) << 7;
                buffer[pos++] = c;
              }
            } else if (bits === 8) {
              for (i = 0; i < colors; ++i) {
                buffer[pos++] = rawBytes[i];
              }

              for (; i < rowBytes; ++i) {
                buffer[pos] = buffer[pos - colors] + rawBytes[i];
                pos++;
              }
            } else if (bits === 16) {
              var bytesPerPixel = colors * 2;

              for (i = 0; i < bytesPerPixel; ++i) {
                buffer[pos++] = rawBytes[i];
              }

              for (; i < rowBytes; i += 2) {
                var sum =
                  ((rawBytes[i] & 0xff) << 8) +
                  (rawBytes[i + 1] & 0xff) +
                  ((buffer[pos - bytesPerPixel] & 0xff) << 8) +
                  (buffer[pos - bytesPerPixel + 1] & 0xff);
                buffer[pos++] = (sum >> 8) & 0xff;
                buffer[pos++] = sum & 0xff;
              }
            } else {
              var compArray = new Uint8Array(colors + 1);
              var bitMask = (1 << bits) - 1;
              var j = 0,
                k = bufferLength;
              var columns = this.columns;

              for (i = 0; i < columns; ++i) {
                for (var kk = 0; kk < colors; ++kk) {
                  if (inbits < bits) {
                    inbuf = (inbuf << 8) | (rawBytes[j++] & 0xff);
                    inbits += 8;
                  }

                  compArray[kk] =
                    (compArray[kk] + (inbuf >> (inbits - bits))) & bitMask;
                  inbits -= bits;
                  outbuf = (outbuf << bits) | compArray[kk];
                  outbits += bits;

                  if (outbits >= 8) {
                    buffer[k++] = (outbuf >> (outbits - 8)) & 0xff;
                    outbits -= 8;
                  }
                }
              }

              if (outbits > 0) {
                buffer[k++] =
                  (outbuf << (8 - outbits)) +
                  (inbuf & ((1 << (8 - outbits)) - 1));
              }
            }

            this.bufferLength += rowBytes;
          };

}
