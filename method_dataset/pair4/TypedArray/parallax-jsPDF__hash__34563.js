          function hash(data, offset, length, mode384) {
            mode384 = !!mode384;
            var h0, h1, h2, h3, h4, h5, h6, h7;

            if (!mode384) {
              h0 = new Word64(0x6a09e667, 0xf3bcc908);
              h1 = new Word64(0xbb67ae85, 0x84caa73b);
              h2 = new Word64(0x3c6ef372, 0xfe94f82b);
              h3 = new Word64(0xa54ff53a, 0x5f1d36f1);
              h4 = new Word64(0x510e527f, 0xade682d1);
              h5 = new Word64(0x9b05688c, 0x2b3e6c1f);
              h6 = new Word64(0x1f83d9ab, 0xfb41bd6b);
              h7 = new Word64(0x5be0cd19, 0x137e2179);
            } else {
              h0 = new Word64(0xcbbb9d5d, 0xc1059ed8);
              h1 = new Word64(0x629a292a, 0x367cd507);
              h2 = new Word64(0x9159015a, 0x3070dd17);
              h3 = new Word64(0x152fecd8, 0xf70e5939);
              h4 = new Word64(0x67332667, 0xffc00b31);
              h5 = new Word64(0x8eb44a87, 0x68581511);
              h6 = new Word64(0xdb0c2e0d, 0x64f98fa7);
              h7 = new Word64(0x47b5481d, 0xbefa4fa4);
            }

            var paddedLength = Math.ceil((length + 17) / 128) * 128;
            var padded = new Uint8Array(paddedLength);
            var i, j, n;

            for (i = 0; i < length; ++i) {
              padded[i] = data[offset++];
            }

            padded[i++] = 0x80;
            n = paddedLength - 16;

            while (i < n) {
              padded[i++] = 0;
            }

            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = 0;
            padded[i++] = (length >>> 29) & 0xff;
            padded[i++] = (length >> 21) & 0xff;
            padded[i++] = (length >> 13) & 0xff;
            padded[i++] = (length >> 5) & 0xff;
            padded[i++] = (length << 3) & 0xff;
            var w = new Array(80);

            for (i = 0; i < 80; i++) {
              w[i] = new Word64(0, 0);
            }

            var a = new Word64(0, 0),
              b = new Word64(0, 0),
              c = new Word64(0, 0);
            var d = new Word64(0, 0),
              e = new Word64(0, 0),
              f = new Word64(0, 0);
            var g = new Word64(0, 0),
              h = new Word64(0, 0);
            var t1 = new Word64(0, 0),
              t2 = new Word64(0, 0);
            var tmp1 = new Word64(0, 0),
              tmp2 = new Word64(0, 0),
              tmp3;

            for (i = 0; i < paddedLength; ) {
              for (j = 0; j < 16; ++j) {
                w[j].high =
                  (padded[i] << 24) |
                  (padded[i + 1] << 16) |
                  (padded[i + 2] << 8) |
                  padded[i + 3];
                w[j].low =
                  (padded[i + 4] << 24) |
                  (padded[i + 5] << 16) |
                  (padded[i + 6] << 8) |
                  padded[i + 7];
                i += 8;
              }

              for (j = 16; j < 80; ++j) {
                tmp3 = w[j];
                littleSigmaPrime(tmp3, w[j - 2], tmp2);
                tmp3.add(w[j - 7]);
                littleSigma(tmp1, w[j - 15], tmp2);
                tmp3.add(tmp1);
                tmp3.add(w[j - 16]);
              }

              a.assign(h0);
              b.assign(h1);
              c.assign(h2);
              d.assign(h3);
              e.assign(h4);
              f.assign(h5);
              g.assign(h6);
              h.assign(h7);

              for (j = 0; j < 80; ++j) {
                t1.assign(h);
                sigmaPrime(tmp1, e, tmp2);
                t1.add(tmp1);
                ch(tmp1, e, f, g, tmp2);
                t1.add(tmp1);
                t1.add(k[j]);
                t1.add(w[j]);
                sigma(t2, a, tmp2);
                maj(tmp1, a, b, c, tmp2);
                t2.add(tmp1);
                tmp3 = h;
                h = g;
                g = f;
                f = e;
                d.add(t1);
                e = d;
                d = c;
                c = b;
                b = a;
                tmp3.assign(t1);
                tmp3.add(t2);
                a = tmp3;
              }

              h0.add(a);
              h1.add(b);
              h2.add(c);
              h3.add(d);
              h4.add(e);
              h5.add(f);
              h6.add(g);
              h7.add(h);
            }

            var result;

            if (!mode384) {
              result = new Uint8Array(64);
              h0.copyTo(result, 0);
              h1.copyTo(result, 8);
              h2.copyTo(result, 16);
              h3.copyTo(result, 24);
              h4.copyTo(result, 32);
              h5.copyTo(result, 40);
              h6.copyTo(result, 48);
              h7.copyTo(result, 56);
            } else {
              result = new Uint8Array(48);
              h0.copyTo(result, 0);
              h1.copyTo(result, 8);
              h2.copyTo(result, 16);
              h3.copyTo(result, 24);
              h4.copyTo(result, 32);
              h5.copyTo(result, 40);
            }

            return result;
          }
