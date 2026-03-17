function convertKeys(keyType, pub, priv, opts) {
  let format = 'new';
  let encrypted;
  let comment = '';
  if (typeof opts === 'object' && opts !== null) {
    if (typeof opts.comment === 'string' && opts.comment)
      comment = opts.comment;
    if (typeof opts.format === 'string' && opts.format)
      format = opts.format;
    if (opts.passphrase) {
      let passphrase;
      if (typeof opts.passphrase === 'string')
        passphrase = Buffer.from(opts.passphrase);
      else if (Buffer.isBuffer(opts.passphrase))
        passphrase = opts.passphrase;
      else
        throw new Error('Invalid passphrase');

      if (opts.cipher === undefined)
        throw new Error('Missing cipher name');
      const cipher = ciphers.get(opts.cipher);
      if (cipher === undefined)
        throw new Error('Invalid cipher name');

      if (format === 'new') {
        let rounds = DEFAULT_ROUNDS;
        if (opts.rounds !== undefined) {
          if (!Number.isInteger(opts.rounds))
            throw new TypeError('rounds must be an integer');
          if (opts.rounds > 0)
            rounds = opts.rounds;
        }

        const gen = Buffer.allocUnsafe(cipher.keyLen + cipher.ivLen);
        const salt = randomBytes(SALT_LEN);
        const r = bcrypt_pbkdf(
          passphrase,
          passphrase.length,
          salt,
          salt.length,
          gen,
          gen.length,
          rounds
        );
        if (r !== 0)
          return new Error('Failed to generate information to encrypt key');

        /*
          string salt
          uint32 rounds
        */
        const kdfOptions = Buffer.allocUnsafe(4 + salt.length + 4);
        {
          let pos = 0;
          kdfOptions.writeUInt32BE(salt.length, pos += 0);
          kdfOptions.set(salt, pos += 4);
          kdfOptions.writeUInt32BE(rounds, pos += salt.length);
        }

        encrypted = {
          cipher,
          cipherName: opts.cipher,
          kdfName: 'bcrypt',
          kdfOptions,
          key: gen.slice(0, cipher.keyLen),
          iv: gen.slice(cipher.keyLen),
        };
      }
    }
  }

  switch (format) {
    case 'new': {
      let privateB64 = '-----BEGIN OPENSSH PRIVATE KEY-----\n';
      let publicB64;
      /*
        byte[]  "openssh-key-v1\0"
        string  ciphername
        string  kdfname
        string  kdfoptions
        uint32  number of keys N
        string  publickey1
        string  encrypted, padded list of private keys
          uint32  checkint
          uint32  checkint
          byte[]  privatekey1
          string  comment1
          byte  1
          byte  2
          byte  3
          ...
          byte  padlen % 255
      */
      const cipherName = Buffer.from(encrypted ? encrypted.cipherName : 'none');
      const kdfName = Buffer.from(encrypted ? encrypted.kdfName : 'none');
      const kdfOptions = (encrypted ? encrypted.kdfOptions : Buffer.alloc(0));
      const blockLen = (encrypted ? encrypted.cipher.blockLen : 8);

      const parsed = parseDERs(keyType, pub, priv);

      const checkInt = randomBytes(4);
      const commentBin = Buffer.from(comment);
      const privBlobLen = (4 + 4 + parsed.priv.length + 4 + commentBin.length);
      let padding = [];
      for (let i = 1; ((privBlobLen + padding.length) % blockLen); ++i)
        padding.push(i & 0xFF);
      padding = Buffer.from(padding);

      let privBlob = Buffer.allocUnsafe(privBlobLen + padding.length);
      let extra;
      {
        let pos = 0;
        privBlob.set(checkInt, pos += 0);
        privBlob.set(checkInt, pos += 4);
        privBlob.set(parsed.priv, pos += 4);
        privBlob.writeUInt32BE(commentBin.length, pos += parsed.priv.length);
        privBlob.set(commentBin, pos += 4);
        privBlob.set(padding, pos += commentBin.length);
      }

      if (encrypted) {
        const options = { authTagLength: encrypted.cipher.authLen };
        const cipher = createCipheriv(
          encrypted.cipher.sslName,
          encrypted.key,
          encrypted.iv,
          options
        );
        cipher.setAutoPadding(false);
        privBlob = Buffer.concat([ cipher.update(privBlob), cipher.final() ]);
        if (encrypted.cipher.authLen > 0)
          extra = cipher.getAuthTag();
        else
          extra = Buffer.alloc(0);
        encrypted.key.fill(0);
        encrypted.iv.fill(0);
      } else {
        extra = Buffer.alloc(0);
      }

      const magicBytes = Buffer.from('openssh-key-v1\0');
      const privBin = Buffer.allocUnsafe(
        magicBytes.length
          + 4 + cipherName.length
          + 4 + kdfName.length
          + 4 + kdfOptions.length
          + 4
          + 4 + parsed.pub.length
          + 4 + privBlob.length
          + extra.length
      );
      {
        let pos = 0;
        privBin.set(magicBytes, pos += 0);
        privBin.writeUInt32BE(cipherName.length, pos += magicBytes.length);
        privBin.set(cipherName, pos += 4);
        privBin.writeUInt32BE(kdfName.length, pos += cipherName.length);
        privBin.set(kdfName, pos += 4);
        privBin.writeUInt32BE(kdfOptions.length, pos += kdfName.length);
        privBin.set(kdfOptions, pos += 4);
        privBin.writeUInt32BE(1, pos += kdfOptions.length);
        privBin.writeUInt32BE(parsed.pub.length, pos += 4);
        privBin.set(parsed.pub, pos += 4);
        privBin.writeUInt32BE(privBlob.length, pos += parsed.pub.length);
        privBin.set(privBlob, pos += 4);
        privBin.set(extra, pos += privBlob.length);
      }

      {
        const b64 = privBin.base64Slice(0, privBin.length);
        let formatted = b64.replace(/.{64}/g, '$&\n');
        if (b64.length & 63)
          formatted += '\n';
        privateB64 += formatted;
      }

      {
        const b64 = parsed.pub.base64Slice(0, parsed.pub.length);
        publicB64 = `${parsed.sshName} ${b64}${comment ? ` ${comment}` : ''}`;
      }

      privateB64 += '-----END OPENSSH PRIVATE KEY-----\n';
      return {
        private: privateB64,
        public: publicB64,
      };
    }
    default:
      throw new Error('Invalid output key format');
  }
}
