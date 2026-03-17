          function calculatePDF20Hash(password, input, userBytes) {
            var k = calculateSHA256(input, 0, input.length).subarray(0, 32);
            var e = [0];
            var i = 0;

            while (i < 64 || e[e.length - 1] > i - 32) {
              var arrayLength = password.length + k.length + userBytes.length;
              var k1 = new Uint8Array(arrayLength * 64);
              var array = concatArrays(password, k);
              array = concatArrays(array, userBytes);

              for (var j = 0, pos = 0; j < 64; j++, pos += arrayLength) {
                k1.set(array, pos);
              }

              var cipher = new AES128Cipher(k.subarray(0, 16));
              e = cipher.encrypt(k1, k.subarray(16, 32));
              var remainder = 0;

              for (var z = 0; z < 16; z++) {
                remainder *= 256 % 3;
                remainder %= 3;
                remainder += (e[z] >>> 0) % 3;
                remainder %= 3;
              }

              if (remainder === 0) {
                k = calculateSHA256(e, 0, e.length);
              } else if (remainder === 1) {
                k = calculateSHA384(e, 0, e.length);
              } else if (remainder === 2) {
                k = calculateSHA512(e, 0, e.length);
              }

              i++;
            }

            return k.subarray(0, 32);
          }
