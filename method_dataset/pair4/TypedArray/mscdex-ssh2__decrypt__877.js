function __method_wrapper__() {
  decrypt(data, p, dataLen) {
    // `data` === encrypted data

    while (p < dataLen) {
      // Read packet length (unencrypted, but AAD)
      if (this._lenBytes < 4) {
        let nb = Math.min(4 - this._lenBytes, dataLen - p);
        this._lenBytes += nb;
        while (nb--)
          this._len = (this._len << 8) + data[p++];
        if (this._lenBytes < 4)
          return;

        if ((this._len + 20) > MAX_PACKET_SIZE
            || this._len < 16
            || (this._len & 15) !== 0) {
          throw new Error('Bad packet length');
        }

        this._decipherInstance = createDecipheriv(
          this._decipherSSLName,
          this._decipherKey,
          this._decipherIV
        );
        this._decipherInstance.setAutoPadding(false);
        this._decipherInstance.setAAD(intToBytes(this._len));
      }

      // Read padding length, payload, and padding
      if (this._pktLen < this._len) {
        if (p >= dataLen)
          return;
        const nb = Math.min(this._len - this._pktLen, dataLen - p);
        let decrypted;
        if (p !== 0 || nb !== dataLen) {
          decrypted = this._decipherInstance.update(
            new Uint8Array(data.buffer, data.byteOffset + p, nb)
          );
        } else {
          decrypted = this._decipherInstance.update(data);
        }
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

      // Read authentication tag
      {
        const nb = Math.min(16 - this._tagPos, dataLen - p);
        if (p !== 0 || nb !== dataLen) {
          this._tag.set(
            new Uint8Array(data.buffer, data.byteOffset + p, nb),
            this._tagPos
          );
        } else {
          this._tag.set(data, this._tagPos);
        }
        p += nb;
        this._tagPos += nb;
        if (this._tagPos < 16)
          return;
      }

      {
        // Verify authentication tag
        this._decipherInstance.setAuthTag(this._tag);

        const decrypted = this._decipherInstance.final();

        // XXX: this should never output any data since stream ciphers always
        // return data from .update() and block ciphers must end on a multiple
        // of the block length, which would have caused an exception to be
        // thrown if the total input was not...
        if (decrypted.length) {
          if (this._packet)
            this._packet.set(decrypted, this._packetPos);
          else
            this._packet = decrypted;
        }
      }

      const payload = (!this._packet
                       ? EMPTY_BUFFER
                       : new FastBuffer(this._packet.buffer,
                                        this._packet.byteOffset + 1,
                                        this._packet.length
                                          - this._packet[0] - 1));

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      ivIncrement(this._decipherIV);
      this._len = 0;
      this._lenBytes = 0;
      this._packet = null;
      this._packetPos = 0;
      this._pktLen = 0;
      this._tagPos = 0;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }

}
