class __C__ {
  encrypt(packet) {
    // `packet` === unencrypted packet

    if (this._dead)
      return;

    let mac;
    if (this._macETM) {
      // Encrypt pad length, payload, and padding
      const lenBytes = new Uint8Array(packet.buffer, packet.byteOffset, 4);
      const encrypted = this._cipherInstance.update(
        new Uint8Array(packet.buffer,
                       packet.byteOffset + 4,
                       packet.length - 4)
      );

      this._onWrite(lenBytes);
      this._onWrite(encrypted);

      // TODO: look into storing seqno as 4-byte buffer and incrementing like we
      // do for AES-GCM IVs to avoid having to (re)write all 4 bytes every time
      mac = createHmac(this._macSSLName, this._macKey);
      writeUInt32BE(BUF_INT, this.outSeqno, 0);
      mac.update(BUF_INT);
      mac.update(lenBytes);
      mac.update(encrypted);
    } else {
      // Encrypt length field, pad length, payload, and padding
      const encrypted = this._cipherInstance.update(packet);
      this._onWrite(encrypted);

      // TODO: look into storing seqno as 4-byte buffer and incrementing like we
      // do for AES-GCM IVs to avoid having to (re)write all 4 bytes every time
      mac = createHmac(this._macSSLName, this._macKey);
      writeUInt32BE(BUF_INT, this.outSeqno, 0);
      mac.update(BUF_INT);
      mac.update(packet);
    }

    let digest = mac.digest();
    if (digest.length > this._macActualLen)
      digest = digest.slice(0, this._macActualLen);
    this._onWrite(digest);

    this.outSeqno = (this.outSeqno + 1) >>> 0;
  }

}
