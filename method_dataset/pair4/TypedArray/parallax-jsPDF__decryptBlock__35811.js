const __obj__ = {
                value: function decryptBlock(data, finalize) {
                  var iv =
                    arguments.length > 2 && arguments[2] !== undefined
                      ? arguments[2]
                      : null;
                  var sourceLength = data.length;
                  var buffer = this.buffer,
                    bufferLength = this.bufferPosition;

                  if (iv) {
                    this.iv = iv;
                  } else {
                    for (
                      var i = 0;
                      bufferLength < 16 && i < sourceLength;
                      ++i, ++bufferLength
                    ) {
                      buffer[bufferLength] = data[i];
                    }

                    if (bufferLength < 16) {
                      this.bufferLength = bufferLength;
                      return new Uint8Array(0);
                    }

                    this.iv = buffer;
                    data = data.subarray(16);
                  }

                  this.buffer = new Uint8Array(16);
                  this.bufferLength = 0;
                  this.decryptBlock = this._decryptBlock2;
                  return this.decryptBlock(data, finalize);
                }

};
