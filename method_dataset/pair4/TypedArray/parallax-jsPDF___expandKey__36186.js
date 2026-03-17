const __obj__ = {
                value: function _expandKey(cipherKey) {
                  var b = 176;
                  var s = this._s;
                  var rcon = this._rcon;
                  var result = new Uint8Array(b);
                  result.set(cipherKey);

                  for (var j = 16, i = 1; j < b; ++i) {
                    var t1 = result[j - 3];
                    var t2 = result[j - 2];
                    var t3 = result[j - 1];
                    var t4 = result[j - 4];
                    t1 = s[t1];
                    t2 = s[t2];
                    t3 = s[t3];
                    t4 = s[t4];
                    t1 = t1 ^ rcon[i];

                    for (var n = 0; n < 4; ++n) {
                      result[j] = t1 ^= result[j - 16];
                      j++;
                      result[j] = t2 ^= result[j - 16];
                      j++;
                      result[j] = t3 ^= result[j - 16];
                      j++;
                      result[j] = t4 ^= result[j - 16];
                      j++;
                    }
                  }

                  return result;
                }

};
