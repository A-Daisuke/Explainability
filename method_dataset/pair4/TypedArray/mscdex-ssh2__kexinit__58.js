function kexinit(self) {
  /*
    byte         SSH_MSG_KEXINIT
    byte[16]     cookie (random bytes)
    name-list    kex_algorithms
    name-list    server_host_key_algorithms
    name-list    encryption_algorithms_client_to_server
    name-list    encryption_algorithms_server_to_client
    name-list    mac_algorithms_client_to_server
    name-list    mac_algorithms_server_to_client
    name-list    compression_algorithms_client_to_server
    name-list    compression_algorithms_server_to_client
    name-list    languages_client_to_server
    name-list    languages_server_to_client
    boolean      first_kex_packet_follows
    uint32       0 (reserved for future extension)
  */

  let payload;
  if (self._compatFlags & COMPAT.BAD_DHGEX) {
    const entry = self._offer.lists.kex;
    let kex = entry.array;
    let found = false;
    for (let i = 0; i < kex.length; ++i) {
      if (kex[i].includes('group-exchange')) {
        if (!found) {
          found = true;
          // Copy array lazily
          kex = kex.slice();
        }
        kex.splice(i--, 1);
      }
    }
    if (found) {
      let len = 1 + 16 + self._offer.totalSize + 1 + 4;
      const newKexBuf = Buffer.from(kex.join(','));
      len -= (entry.buffer.length - newKexBuf.length);

      const all = self._offer.lists.all;
      const rest = new Uint8Array(
        all.buffer,
        all.byteOffset + 4 + entry.buffer.length,
        all.length - (4 + entry.buffer.length)
      );

      payload = Buffer.allocUnsafe(len);
      writeUInt32BE(payload, newKexBuf.length, 17);
      payload.set(newKexBuf, 17 + 4);
      payload.set(rest, 17 + 4 + newKexBuf.length);
    }
  }

  if (payload === undefined) {
    payload = Buffer.allocUnsafe(1 + 16 + self._offer.totalSize + 1 + 4);
    self._offer.copyAllTo(payload, 17);
  }

  self._debug && self._debug('Outbound: Sending KEXINIT');

  payload[0] = MESSAGE.KEXINIT;
  randomFillSync(payload, 1, 16);

  // Zero-fill first_kex_packet_follows and reserved bytes
  bufferFill(payload, 0, payload.length - 5);

  self._kexinit = payload;

  // Needed to correct the starting position in allocated "packets" when packets
  // will be buffered due to active key exchange
  self._packetRW.write.allocStart = 0;

  // TODO: only create single buffer and set _kexinit as slice of packet instead
  {
    const p = self._packetRW.write.allocStartKEX;
    const packet = self._packetRW.write.alloc(payload.length, true);
    packet.set(payload, p);
    self._cipher.encrypt(self._packetRW.write.finalize(packet, true));
  }
}
