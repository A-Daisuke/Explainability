class __C__ {
  encrypt(packet) {
    // `packet` === unencrypted packet

    if (this._dead)
      return;

    // Generate Poly1305 key
    POLY1305_OUT_COMPUTE[0] = 0; // Set counter to 0 (little endian)
    writeUInt32BE(POLY1305_OUT_COMPUTE, this.outSeqno, 12);
    const polyKey =
      createCipheriv('chacha20', this._encKeyMain, POLY1305_OUT_COMPUTE)
      .update(POLY1305_ZEROS);

    // Encrypt packet length
    const pktLenEnc =
      createCipheriv('chacha20', this._encKeyPktLen, POLY1305_OUT_COMPUTE)
      .update(packet.slice(0, 4));
    this._onWrite(pktLenEnc);

    // Encrypt rest of packet
    POLY1305_OUT_COMPUTE[0] = 1; // Set counter to 1 (little endian)
    const payloadEnc =
      createCipheriv('chacha20', this._encKeyMain, POLY1305_OUT_COMPUTE)
      .update(packet.slice(4));
    this._onWrite(payloadEnc);

    // Calculate Poly1305 MAC
    poly1305_auth(POLY1305_RESULT_MALLOC,
                  pktLenEnc,
                  pktLenEnc.length,
                  payloadEnc,
                  payloadEnc.length,
                  polyKey);
    const mac = Buffer.allocUnsafe(16);
    mac.set(
      new Uint8Array(POLY1305_WASM_MODULE.HEAPU8.buffer,
                     POLY1305_RESULT_MALLOC,
                     16),
      0
    );
    this._onWrite(mac);

    this.outSeqno = (this.outSeqno + 1) >>> 0;
  }

}
