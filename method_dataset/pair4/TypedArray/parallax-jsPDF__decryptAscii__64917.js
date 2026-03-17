          function decryptAscii(data, key, discardNumber) {
            var r = key | 0,
              c1 = 52845,
              c2 = 22719;
            var count = data.length,
              maybeLength = count >>> 1;
            var decrypted = new Uint8Array(maybeLength);
            var i, j;

            for (i = 0, j = 0; i < count; i++) {
              var digit1 = data[i];

              if (!isHexDigit(digit1)) {
                continue;
              }

              i++;
              var digit2;

              while (i < count && !isHexDigit((digit2 = data[i]))) {
                i++;
              }

              if (i < count) {
                var value = parseInt(String.fromCharCode(digit1, digit2), 16);
                decrypted[j++] = value ^ (r >> 8);
                r = ((value + r) * c1 + c2) & ((1 << 16) - 1);
              }
            }

            return Array.prototype.slice.call(decrypted, discardNumber, j);
          }
