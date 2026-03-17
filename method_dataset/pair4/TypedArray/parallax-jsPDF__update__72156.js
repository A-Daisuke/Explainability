function __method_wrapper__() {
                value: function update(input) {
                  var data, length;

                  if ((0, _util.isString)(input)) {
                    data = new Uint8Array(input.length * 2);
                    length = 0;

                    for (var i = 0, ii = input.length; i < ii; i++) {
                      var code = input.charCodeAt(i);

                      if (code <= 0xff) {
                        data[length++] = code;
                      } else {
                        data[length++] = code >>> 8;
                        data[length++] = code & 0xff;
                      }
                    }
                  } else if ((0, _util.isArrayBuffer)(input)) {
                    data = input;
                    length = data.byteLength;
                  } else {
                    throw new Error(
                      "Wrong data format in MurmurHash3_64_update. " +
                        "Input must be a string or array."
                    );
                  }

                  var blockCounts = length >> 2;
                  var tailLength = length - blockCounts * 4;
                  var dataUint32 = new Uint32Array(data.buffer, 0, blockCounts);
                  var k1 = 0,
                    k2 = 0;
                  var h1 = this.h1,
                    h2 = this.h2;
                  var C1 = 0xcc9e2d51,
                    C2 = 0x1b873593;
                  var C1_LOW = C1 & MASK_LOW,
                    C2_LOW = C2 & MASK_LOW;

                  for (var _i = 0; _i < blockCounts; _i++) {
                    if (_i & 1) {
                      k1 = dataUint32[_i];
                      k1 = ((k1 * C1) & MASK_HIGH) | ((k1 * C1_LOW) & MASK_LOW);
                      k1 = (k1 << 15) | (k1 >>> 17);
                      k1 = ((k1 * C2) & MASK_HIGH) | ((k1 * C2_LOW) & MASK_LOW);
                      h1 ^= k1;
                      h1 = (h1 << 13) | (h1 >>> 19);
                      h1 = h1 * 5 + 0xe6546b64;
                    } else {
                      k2 = dataUint32[_i];
                      k2 = ((k2 * C1) & MASK_HIGH) | ((k2 * C1_LOW) & MASK_LOW);
                      k2 = (k2 << 15) | (k2 >>> 17);
                      k2 = ((k2 * C2) & MASK_HIGH) | ((k2 * C2_LOW) & MASK_LOW);
                      h2 ^= k2;
                      h2 = (h2 << 13) | (h2 >>> 19);
                      h2 = h2 * 5 + 0xe6546b64;
                    }
                  }

                  k1 = 0;

                  switch (tailLength) {
                    case 3:
                      k1 ^= data[blockCounts * 4 + 2] << 16;

                    case 2:
                      k1 ^= data[blockCounts * 4 + 1] << 8;

                    case 1:
                      k1 ^= data[blockCounts * 4];
                      k1 = ((k1 * C1) & MASK_HIGH) | ((k1 * C1_LOW) & MASK_LOW);
                      k1 = (k1 << 15) | (k1 >>> 17);
                      k1 = ((k1 * C2) & MASK_HIGH) | ((k1 * C2_LOW) & MASK_LOW);

                      if (blockCounts & 1) {
                        h1 ^= k1;
                      } else {
                        h2 ^= k1;
                      }
                  }

                  this.h1 = h1;
                  this.h2 = h2;
                }

}
