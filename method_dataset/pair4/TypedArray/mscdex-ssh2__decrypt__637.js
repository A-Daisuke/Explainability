class __C__ {
  decrypt(data, p, dataLen) {
    // `data` === encrypted data

    while (p < dataLen) {
      // Read packet length
      if (this._lenPos < 4) {
        let nb = Math.min(4 - this._lenPos, dataLen - p);
        while (nb--)
          this._lenBuf[this._lenPos++] = data[p++];
        if (this._lenPos < 4)
          return;

        POLY1305_OUT_COMPUTE[0] = 0; // Set counter to 0 (little endian)
        writeUInt32BE(POLY1305_OUT_COMPUTE, this.inSeqno, 12);

        const decLenBytes =
          createDecipheriv('chacha20', this._decKeyPktLen, POLY1305_OUT_COMPUTE)
          .update(this._lenBuf);
        this._len = readUInt32BE(decLenBytes, 0);

        if (this._len > MAX_PACKET_SIZE
            || this._len < 8
            || (this._len & 7) !== 0) {
          throw new Error('Bad packet length');
        }
      }

      // Read padding length, payload, and padding
      if (this._pktLen < this._len) {
        if (p >= dataLen)
          return;
        const nb = Math.min(this._len - this._pktLen, dataLen - p);
        let encrypted;
        if (p !== 0 || nb !== dataLen)
          encrypted = new Uint8Array(data.buffer, data.byteOffset + p, nb);
        else
          encrypted = data;
        if (nb === this._len) {
          this._packet = encrypted;
        } else {
          if (!this._packet)
            this._packet = Buffer.allocUnsafe(this._len);
          this._packet.set(encrypted, this._pktLen);
        }
        p += nb;
        this._pktLen += nb;
        if (this._pktLen < this._len || p >= dataLen)
          return;
      }

      // Read Poly1305 MAC
      {
        const nb = Math.min(16 - this._macPos, dataLen - p);
        // TODO: avoid copying if entire MAC is in current chunk
        if (p !== 0 || nb !== dataLen) {
          this._mac.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._macPos
          );
        } else {
          this._mac.set(data, this._macPos);
        }
        p += nb;
        this._macPos += nb;
        if (this._macPos < 16)
          return;
      }

      // Generate Poly1305 key
      POLY1305_OUT_COMPUTE[0] = 0; // Set counter to 0 (little endian)
      writeUInt32BE(POLY1305_OUT_COMPUTE, this.inSeqno, 12);
      const polyKey =
        createCipheriv('chacha20', this._decKeyMain, POLY1305_OUT_COMPUTE)
        .update(POLY1305_ZEROS);

      // Calculate and compare Poly1305 MACs
      poly1305_auth(POLY1305_RESULT_MALLOC,
                    this._lenBuf,
                    4,
                    this._packet,
                    this._packet.length,
                    polyKey);

      this._calcMac.set(
        new Uint8Array(POLY1305_WASM_MODULE.HEAPU8.buffer,
                       POLY1305_RESULT_MALLOC,
                       16),
        0
      );
      if (!timingSafeEqual(this._calcMac, this._mac))
        throw new Error('Invalid MAC');

      // Decrypt packet
      POLY1305_OUT_COMPUTE[0] = 1; // Set counter to 1 (little endian)
      const packet =
        createDecipheriv('chacha20', this._decKeyMain, POLY1305_OUT_COMPUTE)
        .update(this._packet);

      const payload = new FastBuffer(packet.buffer,
                                     packet.byteOffset + 1,
                                     packet.length - packet[0] - 1);

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      this._len = 0;
      this._lenPos = 0;
      this._packet = null;
      this._pktLen = 0;
      this._macPos = 0;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }

}
