class __C__ {
  disconnect(reason) {
    const pktLen = 1 + 4 + 4 + 4;
    // We don't use _packetRW.write.* here because we need to make sure that
    // we always get a full packet allocated because this message can be sent
    // at any time -- even during a key exchange
    let p = this._packetRW.write.allocStartKEX;
    const packet = this._packetRW.write.alloc(pktLen, true);
    const end = p + pktLen;

    if (!VALID_DISCONNECT_REASONS.has(reason))
      reason = DISCONNECT_REASON.PROTOCOL_ERROR;

    packet[p] = MESSAGE.DISCONNECT;
    writeUInt32BE(packet, reason, ++p);
    packet.fill(0, p += 4, end);

    this._debug && this._debug(`Outbound: Sending DISCONNECT (${reason})`);
    sendPacket(this, this._packetRW.write.finalize(packet, true), true);
  }

}
