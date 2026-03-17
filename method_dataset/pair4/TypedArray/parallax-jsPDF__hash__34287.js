          function hash(data, offset, length) {
            var h0 = 0x6a09e667,
              h1 = 0xbb67ae85,
              h2 = 0x3c6ef372,
              h3 = 0xa54ff53a,
              h4 = 0x510e527f,
              h5 = 0x9b05688c,
              h6 = 0x1f83d9ab,
              h7 = 0x5be0cd19;
            var paddedLength = Math.ceil((length + 9) / 64) * 64;
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

            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = (length >>> 29) & 0xff;
            padded[i++] = (length >> 21) & 0xff;
            padded[i++] = (length >> 13) & 0xff;
            padded[i++] = (length >> 5) & 0xff;
            padded[i++] = (length << 3) & 0xff;
            var w = new Uint32Array(64);

            for (i = 0; i < paddedLength; ) {
              for (j = 0; j < 16; ++j) {
                w[j] =
                  (padded[i] << 24) |
                  (padded[i + 1] << 16) |
                  (padded[i + 2] << 8) |
                  padded[i + 3];
                i += 4;
              }

              for (j = 16; j < 64; ++j) {
                w[j] =
                  (littleSigmaPrime(w[j - 2]) +
                    w[j - 7] +
                    littleSigma(w[j - 15]) +
                    w[j - 16]) |
                  0;
              }

              var a = h0,
                b = h1,
                c = h2,
                d = h3,
                e = h4,
                f = h5,
                g = h6,
                h = h7,
                t1,
                t2;

              for (j = 0; j < 64; ++j) {
                t1 = h + sigmaPrime(e) + ch(e, f, g) + k[j] + w[j];
                t2 = sigma(a) + maj(a, b, c);
                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
              }

              h0 = (h0 + a) | 0;
              h1 = (h1 + b) | 0;
              h2 = (h2 + c) | 0;
              h3 = (h3 + d) | 0;
              h4 = (h4 + e) | 0;
              h5 = (h5 + f) | 0;
              h6 = (h6 + g) | 0;
              h7 = (h7 + h) | 0;
            }

            return new Uint8Array([
              (h0 >> 24) & 0xff,
              (h0 >> 16) & 0xff,
              (h0 >> 8) & 0xff,
              h0 & 0xff,
              (h1 >> 24) & 0xff,
              (h1 >> 16) & 0xff,
              (h1 >> 8) & 0xff,
              h1 & 0xff,
              (h2 >> 24) & 0xff,
              (h2 >> 16) & 0xff,
              (h2 >> 8) & 0xff,
              h2 & 0xff,
              (h3 >> 24) & 0xff,
              (h3 >> 16) & 0xff,
              (h3 >> 8) & 0xff,
              h3 & 0xff,
              (h4 >> 24) & 0xff,
              (h4 >> 16) & 0xff,
              (h4 >> 8) & 0xff,
              h4 & 0xff,
              (h5 >> 24) & 0xff,
              (h5 >> 16) & 0xff,
              (h5 >> 8) & 0xff,
              h5 & 0xff,
              (h6 >> 24) & 0xff,
              (h6 >> 16) & 0xff,
              (h6 >> 8) & 0xff,
              h6 & 0xff,
              (h7 >> 24) & 0xff,
              (h7 >> 16) & 0xff,
              (h7 >> 8) & 0xff,
              h7 & 0xff
            ]);
          }
