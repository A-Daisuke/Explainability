function __method_wrapper__() {
  name(reqid, names) {
    if (!this.server)
      throw new Error('Server-only method called in client mode');

    if (!Array.isArray(names)) {
      if (typeof names !== 'object' || names === null)
        throw new Error('names is not an object or array');
      names = [ names ];
    }

    const count = names.length;
    let namesLen = 0;
    let nameAttrs;
    const attrs = [];

    for (let i = 0; i < count; ++i) {
      const name = names[i];
      const filename = (
        !name || !name.filename || typeof name.filename !== 'string'
        ? ''
        : name.filename
      );
      namesLen += 4 + Buffer.byteLength(filename);
      const longname = (
        !name || !name.longname || typeof name.longname !== 'string'
        ? ''
        : name.longname
      );
      namesLen += 4 + Buffer.byteLength(longname);

      if (typeof name.attrs === 'object' && name.attrs !== null) {
        nameAttrs = attrsToBytes(name.attrs);
        namesLen += 4 + nameAttrs.nb;

        if (nameAttrs.nb) {
          let bytes;

          if (nameAttrs.nb === ATTRS_BUF.length) {
            bytes = new Uint8Array(ATTRS_BUF);
          } else {
            bytes = new Uint8Array(nameAttrs.nb);
            bufferCopy(ATTRS_BUF, bytes, 0, nameAttrs.nb, 0);
          }

          nameAttrs.bytes = bytes;
        }

        attrs.push(nameAttrs);
      } else {
        namesLen += 4;
        attrs.push(null);
      }
    }

    let p = 9;
    const buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + namesLen);

    writeUInt32BE(buf, buf.length - 4, 0);
    buf[4] = RESPONSE.NAME;
    writeUInt32BE(buf, reqid, 5);

    writeUInt32BE(buf, count, p);

    p += 4;

    for (let i = 0; i < count; ++i) {
      const name = names[i];

      {
        const filename = (
          !name || !name.filename || typeof name.filename !== 'string'
          ? ''
          : name.filename
        );
        const len = Buffer.byteLength(filename);
        writeUInt32BE(buf, len, p);
        p += 4;
        if (len) {
          buf.utf8Write(filename, p, len);
          p += len;
        }
      }

      {
        const longname = (
          !name || !name.longname || typeof name.longname !== 'string'
          ? ''
          : name.longname
        );
        const len = Buffer.byteLength(longname);
        writeUInt32BE(buf, len, p);
        p += 4;
        if (len) {
          buf.utf8Write(longname, p, len);
          p += len;
        }
      }

      const attr = attrs[i];
      if (attr) {
        writeUInt32BE(buf, attr.flags, p);
        p += 4;
        if (attr.flags && attr.bytes) {
          buf.set(attr.bytes, p);
          p += attr.nb;
        }
      } else {
        writeUInt32BE(buf, 0, p);
        p += 4;
      }
    }

    const isBuffered = sendOrBuffer(this, buf);
    this._debug && this._debug(
      `SFTP: Outbound: ${isBuffered ? 'Buffered' : 'Sending'} NAME`
    );
  }

}
