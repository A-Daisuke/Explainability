          function decodeUserPassword(
            password,
            ownerPassword,
            revision,
            keyLength
          ) {
            var hashData = new Uint8Array(32),
              i = 0,
              j,
              n;
            n = Math.min(32, password.length);

            for (; i < n; ++i) {
              hashData[i] = password[i];
            }

            j = 0;

            while (i < 32) {
              hashData[i++] = defaultPasswordBytes[j++];
            }

            var hash = calculateMD5(hashData, 0, i);
            var keyLengthInBytes = keyLength >> 3;

            if (revision >= 3) {
              for (j = 0; j < 50; ++j) {
                hash = calculateMD5(hash, 0, hash.length);
              }
            }

            var cipher, userPassword;

            if (revision >= 3) {
              userPassword = ownerPassword;
              var derivedKey = new Uint8Array(keyLengthInBytes),
                k;

              for (j = 19; j >= 0; j--) {
                for (k = 0; k < keyLengthInBytes; ++k) {
                  derivedKey[k] = hash[k] ^ j;
                }

                cipher = new ARCFourCipher(derivedKey);
                userPassword = cipher.encryptBlock(userPassword);
              }
            } else {
              cipher = new ARCFourCipher(hash.subarray(0, keyLengthInBytes));
              userPassword = cipher.encryptBlock(ownerPassword);
            }

            return userPassword;
          }
