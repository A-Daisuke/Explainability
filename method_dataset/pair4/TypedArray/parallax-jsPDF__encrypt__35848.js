function __method_wrapper__() {
                value: function encrypt(data, iv) {
                  var sourceLength = data.length;
                  var buffer = this.buffer,
                    bufferLength = this.bufferPosition;
                  var result = [];

                  if (!iv) {
                    iv = new Uint8Array(16);
                  }

                  for (var i = 0; i < sourceLength; ++i) {
                    buffer[bufferLength] = data[i];
                    ++bufferLength;

                    if (bufferLength < 16) {
                      continue;
                    }

                    for (var j = 0; j < 16; ++j) {
                      buffer[j] ^= iv[j];
                    }

                    var cipher = this._encrypt(buffer, this._key);

                    iv = cipher;
                    result.push(cipher);
                    buffer = new Uint8Array(16);
                    bufferLength = 0;
                  }

                  this.buffer = buffer;
                  this.bufferLength = bufferLength;
                  this.iv = iv;

                  if (result.length === 0) {
                    return new Uint8Array(0);
                  }

                  var outputLength = 16 * result.length;
                  var output = new Uint8Array(outputLength);

                  for (
                    var _i3 = 0, _j11 = 0, ii = result.length;
                    _i3 < ii;
                    ++_i3, _j11 += 16
                  ) {
                    output.set(result[_i3], _j11);
                  }

                  return output;
                }

}
