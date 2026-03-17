function __method_wrapper__() {
  [MESSAGE.USERAUTH_REQUEST]: (self, payload) => {
    /*
      byte      SSH_MSG_USERAUTH_REQUEST
      string    user name in ISO-10646 UTF-8 encoding [RFC3629]
      string    service name in US-ASCII
      string    method name in US-ASCII
      ....      method specific fields
    */
    bufferParser.init(payload, 1);
    const user = bufferParser.readString(true);
    const service = bufferParser.readString(true);
    const method = bufferParser.readString(true);
    let methodData;
    let methodDesc;
    switch (method) {
      case 'none':
        methodData = null;
        break;
      case 'password': {
        /*
          boolean   <new password follows (old) plaintext password?>
          string    plaintext password in ISO-10646 UTF-8 encoding [RFC3629]
         [string    new password]
        */
        const isChange = bufferParser.readBool();
        if (isChange !== undefined) {
          methodData = bufferParser.readString(true);
          if (methodData !== undefined && isChange) {
            const newPassword = bufferParser.readString(true);
            if (newPassword !== undefined)
              methodData = { oldPassword: methodData, newPassword };
            else
              methodData = undefined;
          }
        }
        break;
      }
      case 'publickey': {
        /*
          boolean   <signature follows public key blob?>
          string    public key algorithm name
          string    public key blob
         [string    signature]
        */
        const hasSig = bufferParser.readBool();
        if (hasSig !== undefined) {
          const keyAlgo = bufferParser.readString(true);
          let realKeyAlgo = keyAlgo;
          const key = bufferParser.readString();

          let hashAlgo;
          switch (keyAlgo) {
            case 'rsa-sha2-256':
              realKeyAlgo = 'ssh-rsa';
              hashAlgo = 'sha256';
              break;
            case 'rsa-sha2-512':
              realKeyAlgo = 'ssh-rsa';
              hashAlgo = 'sha512';
              break;
          }

          if (hasSig) {
            const blobEnd = bufferParser.pos();
            let signature = bufferParser.readString();
            if (signature !== undefined) {
              if (signature.length > (4 + keyAlgo.length + 4)
                  && signature.utf8Slice(4, 4 + keyAlgo.length) === keyAlgo) {
                // Skip algoLen + algo + sigLen
                signature = bufferSlice(signature, 4 + keyAlgo.length + 4);
              }

              signature = sigSSHToASN1(signature, realKeyAlgo);
              if (signature) {
                const sessionID = self._kex.sessionID;
                const blob = Buffer.allocUnsafe(4 + sessionID.length + blobEnd);
                writeUInt32BE(blob, sessionID.length, 0);
                blob.set(sessionID, 4);
                blob.set(
                  new Uint8Array(payload.buffer, payload.byteOffset, blobEnd),
                  4 + sessionID.length
                );
                methodData = {
                  keyAlgo: realKeyAlgo,
                  key,
                  signature,
                  blob,
                  hashAlgo,
                };
              }
            }
          } else {
            methodData = { keyAlgo: realKeyAlgo, key, hashAlgo };
            methodDesc = 'publickey -- check';
          }
        }
        break;
      }
      case 'hostbased': {
        /*
          string    public key algorithm for host key
          string    public host key and certificates for client host
          string    client host name expressed as the FQDN in US-ASCII
          string    user name on the client host in ISO-10646 UTF-8 encoding
                     [RFC3629]
          string    signature
        */
        const keyAlgo = bufferParser.readString(true);
        let realKeyAlgo = keyAlgo;
        const key = bufferParser.readString();
        const localHostname = bufferParser.readString(true);
        const localUsername = bufferParser.readString(true);

        let hashAlgo;
        switch (keyAlgo) {
          case 'rsa-sha2-256':
            realKeyAlgo = 'ssh-rsa';
            hashAlgo = 'sha256';
            break;
          case 'rsa-sha2-512':
            realKeyAlgo = 'ssh-rsa';
            hashAlgo = 'sha512';
            break;
        }

        const blobEnd = bufferParser.pos();
        let signature = bufferParser.readString();
        if (signature !== undefined) {
          if (signature.length > (4 + keyAlgo.length + 4)
              && signature.utf8Slice(4, 4 + keyAlgo.length) === keyAlgo) {
            // Skip algoLen + algo + sigLen
            signature = bufferSlice(signature, 4 + keyAlgo.length + 4);
          }

          signature = sigSSHToASN1(signature, realKeyAlgo);
          if (signature !== undefined) {
            const sessionID = self._kex.sessionID;
            const blob = Buffer.allocUnsafe(4 + sessionID.length + blobEnd);
            writeUInt32BE(blob, sessionID.length, 0);
            blob.set(sessionID, 4);
            blob.set(
              new Uint8Array(payload.buffer, payload.byteOffset, blobEnd),
              4 + sessionID.length
            );
            methodData = {
              keyAlgo: realKeyAlgo,
              key,
              signature,
              blob,
              localHostname,
              localUsername,
              hashAlgo
            };
          }
        }
        break;
      }
      case 'keyboard-interactive':
        /*
          string    language tag (as defined in [RFC-3066])
          string    submethods (ISO-10646 UTF-8)
        */
        // Skip/ignore language field -- it's deprecated in RFC 4256
        bufferParser.skipString();

        methodData = bufferParser.readList();
        break;
      default:
        if (method !== undefined)
          methodData = bufferParser.readRaw();
    }
    bufferParser.clear();

    if (methodData === undefined) {
      return doFatalError(
        self,
        'Inbound: Malformed USERAUTH_REQUEST packet'
      );
    }

    if (methodDesc === undefined)
      methodDesc = method;

    self._authsQueue.push(method);

    self._debug
      && self._debug(`Inbound: Received USERAUTH_REQUEST (${methodDesc})`);

    const handler = self._handlers.USERAUTH_REQUEST;
    handler && handler(self, user, service, method, methodData);
  },

}
