          function ARCFourCipher(key) {
            this.a = 0;
            this.b = 0;
            var s = new Uint8Array(256);
            var i,
              j = 0,
              tmp,
              keyLength = key.length;

            for (i = 0; i < 256; ++i) {
              s[i] = i;
            }

            for (i = 0; i < 256; ++i) {
              tmp = s[i];
              j = (j + tmp + key[i % keyLength]) & 0xff;
              s[i] = s[j];
              s[j] = tmp;
            }

            this.s = s;
          }
