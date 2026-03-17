class __C__ {
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

        let decrypted;
        let need;
        if (this._macETM) {
          this._len = need = readUInt32BE(this._block, 0);
        } else {
          // Decrypt first block to get packet length
          decrypted = this._decipherInstance.update(this._block);
          this._len = readUInt32BE(decrypted, 0);
          need = 4 + this._len - this._blockSize;
        }

        if (this._len > MAX_PACKET_SIZE
            || this._len < 5
            || (need & (this._blockSize - 1)) !== 0) {
          throw new Error('Bad packet length');
        }

        // Create MAC up front to calculate in parallel with decryption
        this._macInstance = createHmac(this._macSSLName, this._macKey);

        writeUInt32BE(BUF_INT, this.inSeqno, 0);
        this._macInstance.update(BUF_INT);
        if (this._macETM) {
          this._macInstance.update(this._block);
        } else {
          this._macInstance.update(new Uint8Array(decrypted.buffer,
                                                  decrypted.byteOffset,
                                                  4));
          this._pktLen = decrypted.length - 4;
          this._packetPos = this._pktLen;
          this._packet = Buffer.allocUnsafe(this._len);
          this._packet.set(
            new Uint8Array(decrypted.buffer,
                           decrypted.byteOffset + 4,
                           this._packetPos),
            0
          );
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
        if (this._macETM)
          this._macInstance.update(encrypted);
        const decrypted = this._decipherInstance.update(encrypted);
        if (decrypted.length) {
          if (nb === this._len) {
            this._packet = decrypted;
          } else {
            if (!this._packet)
              this._packet = Buffer.allocUnsafe(this._len);
            this._packet.set(decrypted, this._packetPos);
          }
          this._packetPos += decrypted.length;
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

      // Verify MAC
      if (!this._macETM)
        this._macInstance.update(this._packet);
      let calculated = this._macInstance.digest();
      if (this._macActualLen < calculated.length) {
        calculated = new Uint8Array(calculated.buffer,
                                    calculated.byteOffset,
                                    this._macActualLen);
      }
      if (!timingSafeEquals(calculated, this._mac))
        throw new Error('Invalid MAC');

      const payload = new FastBuffer(this._packet.buffer,
                                     this._packet.byteOffset + 1,
                                     this._packet.length - this._packet[0] - 1);

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      this._blockPos = 0;
      this._len = 0;
      this._packet = null;
      this._packetPos = 0;
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
