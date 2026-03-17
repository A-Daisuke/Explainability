function __method_wrapper__() {
            getOwnerKey: function PDF20_getOwnerKey(
              password,
              ownerKeySalt,
              userBytes,
              ownerEncryption
            ) {
              var hashData = new Uint8Array(password.length + 56);
              hashData.set(password, 0);
              hashData.set(ownerKeySalt, password.length);
              hashData.set(userBytes, password.length + ownerKeySalt.length);
              var key = calculatePDF20Hash(password, hashData, userBytes);
              var cipher = new AES256Cipher(key);
              return cipher.decryptBlock(
                ownerEncryption,
                false,
                new Uint8Array(16)
              );
            },

}
