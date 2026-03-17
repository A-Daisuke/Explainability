function __method_wrapper__() {
            getBytes: function getBytes(length) {
              var forceClamped =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : false;
              var end,
                pos = this.pos;

              if (length) {
                this.ensureBuffer(pos + length);
                end = pos + length;

                while (!this.eof && this.bufferLength < end) {
                  this.readBlock();
                }

                var bufEnd = this.bufferLength;

                if (end > bufEnd) {
                  end = bufEnd;
                }
              } else {
                while (!this.eof) {
                  this.readBlock();
                }

                end = this.bufferLength;
              }

              this.pos = end;
              var subarray = this.buffer.subarray(pos, end);
              return forceClamped && !(subarray instanceof Uint8ClampedArray)
                ? new Uint8ClampedArray(subarray)
                : subarray;
            },

}
