function __method_wrapper__() {
            checkOwnerPassword: function PDF20_checkOwnerPassword(
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
              var result = calculatePDF20Hash(password, hashData, userBytes);
              return compareByteArrays(result, ownerPassword);
            },

}
