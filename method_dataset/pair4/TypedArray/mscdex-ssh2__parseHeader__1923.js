function parseHeader(chunk, p, len) {
  let data;
  let chunkOffset;
  if (this._buffer) {
    data = Buffer.allocUnsafe(this._buffer.length + (len - p));
    data.set(this._buffer, 0);
    if (p === 0) {
      data.set(chunk, this._buffer.length);
    } else {
      data.set(new Uint8Array(chunk.buffer,
                              chunk.byteOffset + p,
                              (len - p)),
               this._buffer.length);
    }
    chunkOffset = this._buffer.length;
    p = 0;
  } else {
    data = chunk;
    chunkOffset = 0;
  }
  const op = p;
  let start = p;
  let end = p;
  let needNL = false;
  let lineLen = 0;
  let lines = 0;
  for (; p < data.length; ++p) {
    const ch = data[p];

    if (ch === 13 /* '\r' */) {
      needNL = true;
      continue;
    }

    if (ch === 10 /* '\n' */) {
      if (end > start
          && end - start > 4
          && data[start] === 83 /* 'S' */
          && data[start + 1] === 83 /* 'S' */
          && data[start + 2] === 72 /* 'H' */
          && data[start + 3] === 45 /* '-' */) {

        const full = data.latin1Slice(op, end + 1);
        const identRaw = (start === op ? full : full.slice(start - op));
        const m = RE_IDENT.exec(identRaw);
        if (!m)
          throw new Error('Invalid identification string');

        const header = {
          greeting: (start === op ? '' : full.slice(0, start - op)),
          identRaw,
          versions: {
            protocol: m[1],
            software: m[2],
          },
          comments: m[3]
        };

        // Needed during handshake
        this._remoteIdentRaw = Buffer.from(identRaw);

        this._debug && this._debug(`Remote ident: ${inspect(identRaw)}`);
        this._compatFlags = getCompatFlags(header);

        this._buffer = undefined;
        this._decipher =
          new NullDecipher(0, onKEXPayload.bind(this, { firstPacket: true }));
        this._parse = parsePacket;

        this._onHeader(header);
        if (!this._destruct) {
          // We disconnected inside _onHeader
          return len;
        }

        kexinit(this);

        return p + 1 - chunkOffset;
      }

      // Only allow pre-ident greetings when we're a client
      if (this._server)
        throw new Error('Greetings from clients not permitted');

      if (++lines > MAX_LINES)
        throw new Error('Max greeting lines exceeded');

      needNL = false;
      start = p + 1;
      lineLen = 0;
    } else if (needNL) {
      throw new Error('Invalid header: expected newline');
    } else if (++lineLen >= MAX_LINE_LEN) {
      throw new Error('Header line too long');
    }

    end = p;
  }
  if (!this._buffer)
    this._buffer = bufferSlice(data, op);

  return p - chunkOffset;
}
