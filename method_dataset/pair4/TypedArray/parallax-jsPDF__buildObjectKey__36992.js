          function buildObjectKey(num, gen, encryptionKey, isAes) {
            var key = new Uint8Array(encryptionKey.length + 9),
              i,
              n;

            for (i = 0, n = encryptionKey.length; i < n; ++i) {
              key[i] = encryptionKey[i];
            }

            key[i++] = num & 0xff;
            key[i++] = (num >> 8) & 0xff;
            key[i++] = (num >> 16) & 0xff;
            key[i++] = gen & 0xff;
            key[i++] = (gen >> 8) & 0xff;

            if (isAes) {
              key[i++] = 0x73;
              key[i++] = 0x41;
              key[i++] = 0x6c;
              key[i++] = 0x54;
            }

            var hash = calculateMD5(key, 0, i);
            return hash.subarray(0, Math.min(encryptionKey.length + 5, 16));
          }
