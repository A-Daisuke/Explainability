          function prepareKeyData(
            fileId,
            password,
            ownerPassword,
            userPassword,
            flags,
            revision,
            keyLength,
            encryptMetadata
          ) {
            var hashDataSize = 40 + ownerPassword.length + fileId.length;
            var hashData = new Uint8Array(hashDataSize),
              i = 0,
              j,
              n;

            if (password) {
              n = Math.min(32, password.length);

              for (; i < n; ++i) {
                hashData[i] = password[i];
              }
            }

            j = 0;

            while (i < 32) {
              hashData[i++] = defaultPasswordBytes[j++];
            }

            for (j = 0, n = ownerPassword.length; j < n; ++j) {
              hashData[i++] = ownerPassword[j];
            }

            hashData[i++] = flags & 0xff;
            hashData[i++] = (flags >> 8) & 0xff;
            hashData[i++] = (flags >> 16) & 0xff;
            hashData[i++] = (flags >>> 24) & 0xff;

            for (j = 0, n = fileId.length; j < n; ++j) {
              hashData[i++] = fileId[j];
            }

            if (revision >= 4 && !encryptMetadata) {
              hashData[i++] = 0xff;
              hashData[i++] = 0xff;
              hashData[i++] = 0xff;
              hashData[i++] = 0xff;
            }

            var hash = calculateMD5(hashData, 0, i);
            var keyLengthInBytes = keyLength >> 3;

            if (revision >= 3) {
              for (j = 0; j < 50; ++j) {
                hash = calculateMD5(hash, 0, keyLengthInBytes);
              }
            }

            var encryptionKey = hash.subarray(0, keyLengthInBytes);
            var cipher, checkData;

            if (revision >= 3) {
              for (i = 0; i < 32; ++i) {
                hashData[i] = defaultPasswordBytes[i];
              }

              for (j = 0, n = fileId.length; j < n; ++j) {
                hashData[i++] = fileId[j];
              }

              cipher = new ARCFourCipher(encryptionKey);
              checkData = cipher.encryptBlock(calculateMD5(hashData, 0, i));
              n = encryptionKey.length;
              var derivedKey = new Uint8Array(n),
                k;

              for (j = 1; j <= 19; ++j) {
                for (k = 0; k < n; ++k) {
                  derivedKey[k] = encryptionKey[k] ^ j;
                }

                cipher = new ARCFourCipher(derivedKey);
                checkData = cipher.encryptBlock(checkData);
              }

              for (j = 0, n = checkData.length; j < n; ++j) {
                if (userPassword[j] !== checkData[j]) {
                  return null;
                }
              }
            } else {
              cipher = new ARCFourCipher(encryptionKey);
              checkData = cipher.encryptBlock(defaultPasswordBytes);

              for (j = 0, n = checkData.length; j < n; ++j) {
                if (userPassword[j] !== checkData[j]) {
                  return null;
                }
              }
            }

            return encryptionKey;
          }
