const __obj__ = {
                value: function _decryptBlock2(data, finalize) {
                  var sourceLength = data.length;
                  var buffer = this.buffer,
                    bufferLength = this.bufferPosition;
                  var result = [],
                    iv = this.iv;

                  for (var i = 0; i < sourceLength; ++i) {
                    buffer[bufferLength] = data[i];
                    ++bufferLength;

                    if (bufferLength < 16) {
                      continue;
                    }

                    var plain = this._decrypt(buffer, this._key);

                    for (var j = 0; j < 16; ++j) {
                      plain[j] ^= iv[j];
                    }

                    iv = buffer;
                    result.push(plain);
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

                  if (finalize) {
                    var lastBlock = result[result.length - 1];
                    var psLen = lastBlock[15];

                    if (psLen <= 16) {
                      for (var _i = 15, ii = 16 - psLen; _i >= ii; --_i) {
                        if (lastBlock[_i] !== psLen) {
                          psLen = 0;
                          break;
                        }
                      }

                      outputLength -= psLen;
                      result[result.length - 1] = lastBlock.subarray(
                        0,
                        16 - psLen
                      );
                    }
                  }

                  var output = new Uint8Array(outputLength);

                  for (
                    var _i2 = 0, _j10 = 0, _ii = result.length;
                    _i2 < _ii;
                    ++_i2, _j10 += 16
                  ) {
                    output.set(result[_i2], _j10);
                  }

                  return output;
                }

};
