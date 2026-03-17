const __obj__ = {
                value: function _encrypt(input, key) {
                  var s = this._s;
                  var t, u, v;
                  var state = new Uint8Array(16);
                  state.set(input);

                  for (var j = 0; j < 16; ++j) {
                    state[j] ^= key[j];
                  }

                  for (var i = 1; i < this._cyclesOfRepetition; i++) {
                    for (var _j5 = 0; _j5 < 16; ++_j5) {
                      state[_j5] = s[state[_j5]];
                    }

                    v = state[1];
                    state[1] = state[5];
                    state[5] = state[9];
                    state[9] = state[13];
                    state[13] = v;
                    v = state[2];
                    u = state[6];
                    state[2] = state[10];
                    state[6] = state[14];
                    state[10] = v;
                    state[14] = u;
                    v = state[3];
                    u = state[7];
                    t = state[11];
                    state[3] = state[15];
                    state[7] = v;
                    state[11] = u;
                    state[15] = t;

                    for (var _j6 = 0; _j6 < 16; _j6 += 4) {
                      var s0 = state[_j6 + 0];
                      var s1 = state[_j6 + 1];
                      var s2 = state[_j6 + 2];
                      var s3 = state[_j6 + 3];
                      t = s0 ^ s1 ^ s2 ^ s3;
                      state[_j6 + 0] ^= t ^ this._mixCol[s0 ^ s1];
                      state[_j6 + 1] ^= t ^ this._mixCol[s1 ^ s2];
                      state[_j6 + 2] ^= t ^ this._mixCol[s2 ^ s3];
                      state[_j6 + 3] ^= t ^ this._mixCol[s3 ^ s0];
                    }

                    for (var _j7 = 0, k = i * 16; _j7 < 16; ++_j7, ++k) {
                      state[_j7] ^= key[k];
                    }
                  }

                  for (var _j8 = 0; _j8 < 16; ++_j8) {
                    state[_j8] = s[state[_j8]];
                  }

                  v = state[1];
                  state[1] = state[5];
                  state[5] = state[9];
                  state[9] = state[13];
                  state[13] = v;
                  v = state[2];
                  u = state[6];
                  state[2] = state[10];
                  state[6] = state[14];
                  state[10] = v;
                  state[14] = u;
                  v = state[3];
                  u = state[7];
                  t = state[11];
                  state[3] = state[15];
                  state[7] = v;
                  state[11] = u;
                  state[15] = t;

                  for (
                    var _j9 = 0, _k2 = this._keySize;
                    _j9 < 16;
                    ++_j9, ++_k2
                  ) {
                    state[_j9] ^= key[_k2];
                  }

                  return state;
                }

};
