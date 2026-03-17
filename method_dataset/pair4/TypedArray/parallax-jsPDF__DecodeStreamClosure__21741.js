        var DecodeStream = (function DecodeStreamClosure() {
          var emptyBuffer = new Uint8Array(0);

          function DecodeStream(maybeMinBufferLength) {
            this._rawMinBufferLength = maybeMinBufferLength || 0;
            this.pos = 0;
            this.bufferLength = 0;
            this.eof = false;
            this.buffer = emptyBuffer;
            this.minBufferLength = 512;

            if (maybeMinBufferLength) {
              while (this.minBufferLength < maybeMinBufferLength) {
                this.minBufferLength *= 2;
              }
            }
          }

          DecodeStream.prototype = {
            get isEmpty() {
              while (!this.eof && this.bufferLength === 0) {
                this.readBlock();
              }

              return this.bufferLength === 0;
            },

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
            getByte: function DecodeStream_getByte() {
              var pos = this.pos;

              while (this.bufferLength <= pos) {
                if (this.eof) {
                  return -1;
                }

                this.readBlock();
              }

              return this.buffer[this.pos++];
            },
            getUint16: function DecodeStream_getUint16() {
              var b0 = this.getByte();
              var b1 = this.getByte();

              if (b0 === -1 || b1 === -1) {
                return -1;
              }

              return (b0 << 8) + b1;
            },
            getInt32: function DecodeStream_getInt32() {
              var b0 = this.getByte();
              var b1 = this.getByte();
              var b2 = this.getByte();
              var b3 = this.getByte();
              return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
            },
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
            peekByte: function DecodeStream_peekByte() {
              var peekedByte = this.getByte();
              this.pos--;
              return peekedByte;
            },
            peekBytes: function peekBytes(length) {
              var forceClamped =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : false;
              var bytes = this.getBytes(length, forceClamped);
              this.pos -= bytes.length;
              return bytes;
            },
            makeSubStream: function DecodeStream_makeSubStream(
              start,
              length,
              dict
            ) {
              var end = start + length;

              while (this.bufferLength <= end && !this.eof) {
                this.readBlock();
              }

              return new Stream(this.buffer, start, length, dict);
            },
            skip: function DecodeStream_skip(n) {
              if (!n) {
                n = 1;
              }

              this.pos += n;
            },
            reset: function DecodeStream_reset() {
              this.pos = 0;
            },
            getBaseStreams: function DecodeStream_getBaseStreams() {
              if (this.str && this.str.getBaseStreams) {
                return this.str.getBaseStreams();
              }

              return [];
            }
          };
          return DecodeStream;
        })();
