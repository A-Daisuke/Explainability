const __obj__ = {
                value: function _decrypt(input, key) {
                  var t, u, v;
                  var state = new Uint8Array(16);
                  state.set(input);

                  for (var j = 0, k = this._keySize; j < 16; ++j, ++k) {
                    state[j] ^= key[k];
                  }

                  for (var i = this._cyclesOfRepetition - 1; i >= 1; --i) {
                    t = state[13];
                    state[13] = state[9];
                    state[9] = state[5];
                    state[5] = state[1];
                    state[1] = t;
                    t = state[14];
                    u = state[10];
                    state[14] = state[6];
                    state[10] = state[2];
                    state[6] = t;
                    state[2] = u;
                    t = state[15];
                    u = state[11];
                    v = state[7];
                    state[15] = state[3];
                    state[11] = t;
                    state[7] = u;
                    state[3] = v;

                    for (var _j = 0; _j < 16; ++_j) {
                      state[_j] = this._inv_s[state[_j]];
                    }

                    for (var _j2 = 0, _k = i * 16; _j2 < 16; ++_j2, ++_k) {
                      state[_j2] ^= key[_k];
                    }

                    for (var _j3 = 0; _j3 < 16; _j3 += 4) {
                      var s0 = this._mix[state[_j3]];
                      var s1 = this._mix[state[_j3 + 1]];
                      var s2 = this._mix[state[_j3 + 2]];
                      var s3 = this._mix[state[_j3 + 3]];
                      t =
                        s0 ^
                        (s1 >>> 8) ^
                        (s1 << 24) ^
                        (s2 >>> 16) ^
                        (s2 << 16) ^
                        (s3 >>> 24) ^
                        (s3 << 8);
                      state[_j3] = (t >>> 24) & 0xff;
                      state[_j3 + 1] = (t >> 16) & 0xff;
                      state[_j3 + 2] = (t >> 8) & 0xff;
                      state[_j3 + 3] = t & 0xff;
                    }
                  }

                  t = state[13];
                  state[13] = state[9];
                  state[9] = state[5];
                  state[5] = state[1];
                  state[1] = t;
                  t = state[14];
                  u = state[10];
                  state[14] = state[6];
                  state[10] = state[2];
                  state[6] = t;
                  state[2] = u;
                  t = state[15];
                  u = state[11];
                  v = state[7];
                  state[15] = state[3];
                  state[11] = t;
                  state[7] = u;
                  state[3] = v;

                  for (var _j4 = 0; _j4 < 16; ++_j4) {
                    state[_j4] = this._inv_s[state[_j4]];
                    state[_j4] ^= key[_j4];
                  }

                  return state;
                }

};
