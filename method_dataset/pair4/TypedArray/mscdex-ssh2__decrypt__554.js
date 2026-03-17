class __C__ {
  decrypt(data, p, dataLen) {
    while (p < dataLen) {
      // Read packet length
      if (this._lenBytes < 4) {
        let nb = Math.min(4 - this._lenBytes, dataLen - p);

        this._lenBytes += nb;
        while (nb--)
          this._len = (this._len << 8) + data[p++];

        if (this._lenBytes < 4)
          return;

        if (this._len > MAX_PACKET_SIZE
            || this._len < 8
            || (4 + this._len & 7) !== 0) {
          throw new Error('Bad packet length');
        }
        if (p >= dataLen)
          return;
      }

      // Read padding length, payload, and padding
      if (this._packetPos < this._len) {
        const nb = Math.min(this._len - this._packetPos, dataLen - p);
        let chunk;
        if (p !== 0 || nb !== dataLen)
          chunk = new Uint8Array(data.buffer, data.byteOffset + p, nb);
        else
          chunk = data;
        if (nb === this._len) {
          this._packet = chunk;
        } else {
          if (!this._packet)
            this._packet = Buffer.allocUnsafe(this._len);
          this._packet.set(chunk, this._packetPos);
        }
        p += nb;
        this._packetPos += nb;
        if (this._packetPos < this._len)
          return;
      }

      const payload = (!this._packet
                       ? EMPTY_BUFFER
                       : new FastBuffer(this._packet.buffer,
                                        this._packet.byteOffset + 1,
                                        this._packet.length
                                          - this._packet[0] - 1));

      // Prepare for next packet
      this.inSeqno = (this.inSeqno + 1) >>> 0;
      this._len = 0;
      this._lenBytes = 0;
      this._packet = null;
      this._packetPos = 0;

      {
        const ret = this._onPayload(payload);
        if (ret !== undefined)
          return (ret === false ? p : ret);
      }
    }
  }

}
