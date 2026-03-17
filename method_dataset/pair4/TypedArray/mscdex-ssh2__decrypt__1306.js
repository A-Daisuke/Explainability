function __method_wrapper__() {
  decrypt(data, p, dataLen) {
    // `data` === encrypted data

    while (p < dataLen) {
      // Read first encrypted block
      if (this._blockPos < this._block.length) {
        const nb = Math.min(this._block.length - this._blockPos, dataLen - p);
        if (p !== 0 || nb !== dataLen || nb < data.length) {
          this._block.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._blockPos
          );
        } else {
          this._block.set(data, this._blockPos);
        }

        p += nb;
        this._blockPos += nb;
        if (this._blockPos < this._block.length)
          return;

        let need;
        if (this._macETM) {
          this._len = need = readUInt32BE(this._block, 0);
        } else {
          // Decrypt first block to get packet length
          this._instance.decryptBlock(this._block);
          this._len = readUInt32BE(this._block, 0);
          need = 4 + this._len - this._block.length;
        }

        if (this._len > MAX_PACKET_SIZE
            || this._len < 5
            || (need & (this._block.length - 1)) !== 0) {
          throw new Error('Bad packet length');
        }

        if (!this._macETM) {
          this._pktLen = (this._block.length - 4);
          if (this._pktLen) {
            this._packet = Buffer.allocUnsafe(this._len);
            this._packet.set(
              new Uint8Array(this._block.buffer,
                             this._block.byteOffset + 4,
                             this._pktLen),
              0
            );
          }
        }

        if (p >= dataLen)
          return;
      }

      // Read padding length, payload, and padding
      if (this._pktLen < this._len) {
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

      // Read MAC
      {
        const nb = Math.min(this._macActualLen - this._macPos, dataLen - p);
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
        if (this._macPos < this._macActualLen)
          return;
      }

      // Decrypt and verify MAC
      this._instance.decrypt(this._packet,
                             this.inSeqno,
                             this._block,
                             this._mac);

      const payload = new FastBuffer(this._packet.buffer,
                                     this._packet.byteOffset + 1,
                                     this._packet.length - this._packet[0] - 1);

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      this._blockPos = 0;
      this._len = 0;
      this._packet = null;
      this._pktLen = 0;
      this._macPos = 0;
      this._macInstance = null;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }

}
