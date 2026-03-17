const __obj__ = {
            getUserKey: function PDF20_getUserKey(
              password,
              userKeySalt,
              userEncryption
            ) {
              var hashData = new Uint8Array(password.length + 8);
              hashData.set(password, 0);
              hashData.set(userKeySalt, password.length);
              var key = calculatePDF20Hash(password, hashData, []);
              var cipher = new AES256Cipher(key);
              return cipher.decryptBlock(
                userEncryption,
                false,
                new Uint8Array(16)
              );
            }

};
