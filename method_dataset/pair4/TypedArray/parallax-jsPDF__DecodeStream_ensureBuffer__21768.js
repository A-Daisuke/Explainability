function __method_wrapper__() {
            ensureBuffer: function DecodeStream_ensureBuffer(requested) {
              var buffer = this.buffer;

              if (requested <= buffer.byteLength) {
                return buffer;
              }

              var size = this.minBufferLength;

              while (size < requested) {
                size *= 2;
              }

              var buffer2 = new Uint8Array(size);
              buffer2.set(buffer);
              return (this.buffer = buffer2);
            },

}
