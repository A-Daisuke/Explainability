          function hash(data, offset, length) {
            var h0 = 1732584193,
              h1 = -271733879,
              h2 = -1732584194,
              h3 = 271733878;
            var paddedLength = (length + 72) & ~63;
            var padded = new Uint8Array(paddedLength);
            var i, j, n;

            for (i = 0; i < length; ++i) {
              padded[i] = data[offset++];
            }

            padded[i++] = 0x80;
            n = paddedLength - 8;

            while (i < n) {
              padded[i++] = 0;
            }

            padded[i++] = (length << 3) & 0xff;
            padded[i++] = (length >> 5) & 0xff;
            padded[i++] = (length >> 13) & 0xff;
            padded[i++] = (length >> 21) & 0xff;
            padded[i++] = (length >>> 29) & 0xff;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            var w = new Int32Array(16);

            for (i = 0; i < paddedLength; ) {
              for (j = 0; j < 16; ++j, i += 4) {
                w[j] =
                  padded[i] |
                  (padded[i + 1] << 8) |
                  (padded[i + 2] << 16) |
                  (padded[i + 3] << 24);
              }

              var a = h0,
                b = h1,
                c = h2,
                d = h3,
                f,
                g;

              for (j = 0; j < 64; ++j) {
                if (j < 16) {
                  f = (b & c) | (~b & d);
                  g = j;
                } else if (j < 32) {
                  f = (d & b) | (~d & c);
                  g = (5 * j + 1) & 15;
                } else if (j < 48) {
                  f = b ^ c ^ d;
                  g = (3 * j + 5) & 15;
                } else {
                  f = c ^ (b | ~d);
                  g = (7 * j) & 15;
                }

                var tmp = d,
                  rotateArg = (a + f + k[j] + w[g]) | 0,
                  rotate = r[j];
                d = c;
                c = b;
                b =
                  (b +
                    ((rotateArg << rotate) | (rotateArg >>> (32 - rotate)))) |
                  0;
                a = tmp;
              }

              h0 = (h0 + a) | 0;
              h1 = (h1 + b) | 0;
              h2 = (h2 + c) | 0;
              h3 = (h3 + d) | 0;
            }

            return new Uint8Array([
              h0 & 0xff,
              (h0 >> 8) & 0xff,
              (h0 >> 16) & 0xff,
              (h0 >>> 24) & 0xff,
              h1 & 0xff,
              (h1 >> 8) & 0xff,
              (h1 >> 16) & 0xff,
              (h1 >>> 24) & 0xff,
              h2 & 0xff,
              (h2 >> 8) & 0xff,
              (h2 >> 16) & 0xff,
              (h2 >>> 24) & 0xff,
              h3 & 0xff,
              (h3 >> 8) & 0xff,
              (h3 >> 16) & 0xff,
              (h3 >>> 24) & 0xff
            ]);
          }
