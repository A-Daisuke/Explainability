        var CipherTransformFactory = (function CipherTransformFactoryClosure() {
          var defaultPasswordBytes = new Uint8Array([
            0x28,
            0xbf,
            0x4e,
            0x5e,
            0x4e,
            0x75,
            0x8a,
            0x41,
            0x64,
            0x00,
            0x4e,
            0x56,
            0xff,
            0xfa,
            0x01,
            0x08,
            0x2e,
            0x2e,
            0x00,
            0xb6,
            0xd0,
            0x68,
            0x3e,
            0x80,
            0x2f,
            0x0c,
            0xa9,
            0xfe,
            0x64,
            0x53,
            0x69,
            0x7a
          ]);

          function createEncryptionKey20(
            revision,
            password,
            ownerPassword,
            ownerValidationSalt,
            ownerKeySalt,
            uBytes,
            userPassword,
            userValidationSalt,
            userKeySalt,
            ownerEncryption,
            userEncryption,
            perms
          ) {
            if (password) {
              var passwordLength = Math.min(127, password.length);
              password = password.subarray(0, passwordLength);
            } else {
              password = [];
            }

            var pdfAlgorithm;

            if (revision === 6) {
              pdfAlgorithm = new PDF20();
            } else {
              pdfAlgorithm = new PDF17();
            }

            if (
              pdfAlgorithm.checkUserPassword(
                password,
                userValidationSalt,
                userPassword
              )
            ) {
              return pdfAlgorithm.getUserKey(
                password,
                userKeySalt,
                userEncryption
              );
            } else if (
              password.length &&
              pdfAlgorithm.checkOwnerPassword(
                password,
                ownerValidationSalt,
                uBytes,
                ownerPassword
              )
            ) {
              return pdfAlgorithm.getOwnerKey(
                password,
                ownerKeySalt,
                uBytes,
                ownerEncryption
              );
            }

            return null;
          }

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

          var identityName = _primitives.Name.get("Identity");

          function CipherTransformFactory(dict, fileId, password) {
            var filter = dict.get("Filter");

            if (!(0, _primitives.isName)(filter, "Standard")) {
              throw new _util.FormatError("unknown encryption method");
            }

            this.dict = dict;
            var algorithm = dict.get("V");

            if (
              !Number.isInteger(algorithm) ||
              (algorithm !== 1 &&
                algorithm !== 2 &&
                algorithm !== 4 &&
                algorithm !== 5)
            ) {
              throw new _util.FormatError("unsupported encryption algorithm");
            }

            this.algorithm = algorithm;
            var keyLength = dict.get("Length");

            if (!keyLength) {
              if (algorithm <= 3) {
                keyLength = 40;
              } else {
                var cfDict = dict.get("CF");
                var streamCryptoName = dict.get("StmF");

                if (
                  (0, _primitives.isDict)(cfDict) &&
                  (0, _primitives.isName)(streamCryptoName)
                ) {
                  cfDict.suppressEncryption = true;
                  var handlerDict = cfDict.get(streamCryptoName.name);
                  keyLength = (handlerDict && handlerDict.get("Length")) || 128;

                  if (keyLength < 40) {
                    keyLength <<= 3;
                  }
                }
              }
            }

            if (
              !Number.isInteger(keyLength) ||
              keyLength < 40 ||
              keyLength % 8 !== 0
            ) {
              throw new _util.FormatError("invalid key length");
            }

            var ownerPassword = (0, _util.stringToBytes)(
              dict.get("O")
            ).subarray(0, 32);
            var userPassword = (0, _util.stringToBytes)(dict.get("U")).subarray(
              0,
              32
            );
            var flags = dict.get("P");
            var revision = dict.get("R");
            var encryptMetadata =
              (algorithm === 4 || algorithm === 5) &&
              dict.get("EncryptMetadata") !== false;
            this.encryptMetadata = encryptMetadata;
            var fileIdBytes = (0, _util.stringToBytes)(fileId);
            var passwordBytes;

            if (password) {
              if (revision === 6) {
                try {
                  password = (0, _util.utf8StringToString)(password);
                } catch (ex) {
                  (0, _util.warn)(
                    "CipherTransformFactory: " +
                      "Unable to convert UTF8 encoded password."
                  );
                }
              }

              passwordBytes = (0, _util.stringToBytes)(password);
            }

            var encryptionKey;

            if (algorithm !== 5) {
              encryptionKey = prepareKeyData(
                fileIdBytes,
                passwordBytes,
                ownerPassword,
                userPassword,
                flags,
                revision,
                keyLength,
                encryptMetadata
              );
            } else {
              var ownerValidationSalt = (0, _util.stringToBytes)(
                dict.get("O")
              ).subarray(32, 40);
              var ownerKeySalt = (0, _util.stringToBytes)(
                dict.get("O")
              ).subarray(40, 48);
              var uBytes = (0, _util.stringToBytes)(dict.get("U")).subarray(
                0,
                48
              );
              var userValidationSalt = (0, _util.stringToBytes)(
                dict.get("U")
              ).subarray(32, 40);
              var userKeySalt = (0, _util.stringToBytes)(
                dict.get("U")
              ).subarray(40, 48);
              var ownerEncryption = (0, _util.stringToBytes)(dict.get("OE"));
              var userEncryption = (0, _util.stringToBytes)(dict.get("UE"));
              var perms = (0, _util.stringToBytes)(dict.get("Perms"));
              encryptionKey = createEncryptionKey20(
                revision,
                passwordBytes,
                ownerPassword,
                ownerValidationSalt,
                ownerKeySalt,
                uBytes,
                userPassword,
                userValidationSalt,
                userKeySalt,
                ownerEncryption,
                userEncryption,
                perms
              );
            }

            if (!encryptionKey && !password) {
              throw new _util.PasswordException(
                "No password given",
                _util.PasswordResponses.NEED_PASSWORD
              );
            } else if (!encryptionKey && password) {
              var decodedPassword = decodeUserPassword(
                passwordBytes,
                ownerPassword,
                revision,
                keyLength
              );
              encryptionKey = prepareKeyData(
                fileIdBytes,
                decodedPassword,
                ownerPassword,
                userPassword,
                flags,
                revision,
                keyLength,
                encryptMetadata
              );
            }

            if (!encryptionKey) {
              throw new _util.PasswordException(
                "Incorrect Password",
                _util.PasswordResponses.INCORRECT_PASSWORD
              );
            }

            this.encryptionKey = encryptionKey;

            if (algorithm >= 4) {
              var cf = dict.get("CF");

              if ((0, _primitives.isDict)(cf)) {
                cf.suppressEncryption = true;
              }

              this.cf = cf;
              this.stmf = dict.get("StmF") || identityName;
              this.strf = dict.get("StrF") || identityName;
              this.eff = dict.get("EFF") || this.stmf;
            }
          }

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

          function buildCipherConstructor(cf, name, num, gen, key) {
            if (!(0, _primitives.isName)(name)) {
              throw new _util.FormatError("Invalid crypt filter name.");
            }

            var cryptFilter = cf.get(name.name);
            var cfm;

            if (cryptFilter !== null && cryptFilter !== undefined) {
              cfm = cryptFilter.get("CFM");
            }

            if (!cfm || cfm.name === "None") {
              return function cipherTransformFactoryBuildCipherConstructorNone() {
                return new NullCipher();
              };
            }

            if (cfm.name === "V2") {
              return function cipherTransformFactoryBuildCipherConstructorV2() {
                return new ARCFourCipher(buildObjectKey(num, gen, key, false));
              };
            }

            if (cfm.name === "AESV2") {
              return function cipherTransformFactoryBuildCipherConstructorAESV2() {
                return new AES128Cipher(buildObjectKey(num, gen, key, true));
              };
            }

            if (cfm.name === "AESV3") {
              return function cipherTransformFactoryBuildCipherConstructorAESV3() {
                return new AES256Cipher(key);
              };
            }

            throw new _util.FormatError("Unknown crypto method");
          }

          CipherTransformFactory.prototype = {
            createCipherTransform: function CipherTransformFactory_createCipherTransform(
              num,
              gen
            ) {
              if (this.algorithm === 4 || this.algorithm === 5) {
                return new CipherTransform(
                  buildCipherConstructor(
                    this.cf,
                    this.stmf,
                    num,
                    gen,
                    this.encryptionKey
                  ),
                  buildCipherConstructor(
                    this.cf,
                    this.strf,
                    num,
                    gen,
                    this.encryptionKey
                  )
                );
              }

              var key = buildObjectKey(num, gen, this.encryptionKey, false);

              var cipherConstructor = function buildCipherCipherConstructor() {
                return new ARCFourCipher(key);
              };

              return new CipherTransform(cipherConstructor, cipherConstructor);
            }
          };
          return CipherTransformFactory;
        })();
