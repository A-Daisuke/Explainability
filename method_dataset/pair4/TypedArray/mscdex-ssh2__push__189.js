function __method_wrapper__() {
  push(data) {
    if (data === null) {
      cleanupRequests(this);
      if (!this.readable)
        return;
      // No more incoming data from the remote side
      this.readable = false;
      this.emit('end');
      return;
    }
    /*
        uint32             length
        byte               type
        byte[length - 1]   data payload
    */
    let p = 0;

    while (p < data.length) {
      if (this._pktLenBytes < 4) {
        let nb = Math.min(4 - this._pktLenBytes, data.length - p);
        this._pktLenBytes += nb;

        while (nb--)
          this._pktLen = (this._pktLen << 8) + data[p++];

        if (this._pktLenBytes < 4)
          return;
        if (this._pktLen === 0)
          return doFatalSFTPError(this, 'Invalid packet length');
        if (this._pktLen > this._maxInPktLen) {
          const max = this._maxInPktLen;
          return doFatalSFTPError(
            this,
            `Packet length ${this._pktLen} exceeds max length of ${max}`
          );
        }
        if (p >= data.length)
          return;
      }
      if (this._pktPos < this._pktLen) {
        const nb = Math.min(this._pktLen - this._pktPos, data.length - p);
        if (p !== 0 || nb !== data.length) {
          if (nb === this._pktLen) {
            this._pkt = new FastBuffer(data.buffer, data.byteOffset + p, nb);
          } else {
            if (!this._pkt)
              this._pkt = Buffer.allocUnsafe(this._pktLen);
            this._pkt.set(
              new Uint8Array(data.buffer, data.byteOffset + p, nb),
              this._pktPos
            );
          }
        } else if (nb === this._pktLen) {
          this._pkt = data;
        } else {
          if (!this._pkt)
            this._pkt = Buffer.allocUnsafe(this._pktLen);
          this._pkt.set(data, this._pktPos);
        }
        p += nb;
        this._pktPos += nb;
        if (this._pktPos < this._pktLen)
          return;
      }

      const type = this._pkt[0];
      const payload = this._pkt;

      // Prepare for next packet
      this._pktLen = 0;
      this._pktLenBytes = 0;
      this._pkt = undefined;
      this._pktPos = 0;

      const handler = (this.server
                       ? SERVER_HANDLERS[type]
                       : CLIENT_HANDLERS[type]);
      if (!handler)
        return doFatalSFTPError(this, `Unknown packet type ${type}`);

      if (this._version === -1) {
        if (this.server) {
          if (type !== REQUEST.INIT)
            return doFatalSFTPError(this, `Expected INIT packet, got ${type}`);
        } else if (type !== RESPONSE.VERSION) {
          return doFatalSFTPError(this, `Expected VERSION packet, got ${type}`);
        }
      }

      if (handler(this, payload) === false)
        return;
    }
  }

}
