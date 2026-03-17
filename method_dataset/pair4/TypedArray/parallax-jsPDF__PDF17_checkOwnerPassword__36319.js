const __obj__ = {
            checkOwnerPassword: function PDF17_checkOwnerPassword(
              password,
              ownerValidationSalt,
              userBytes,
              ownerPassword
            ) {
              var hashData = new Uint8Array(password.length + 56);
              hashData.set(password, 0);
              hashData.set(ownerValidationSalt, password.length);
              hashData.set(
                userBytes,
                password.length + ownerValidationSalt.length
              );
              var result = calculateSHA256(hashData, 0, hashData.length);
              return compareByteArrays(result, ownerPassword);
            },

};
