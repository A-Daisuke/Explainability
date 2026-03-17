function createNTLMv2Response(type2message, username, ntlmhash, nonce, targetName) {
    var buf = new Buffer.alloc(48 + type2message.targetInfo.buffer.length), ntlm2hash = createNTLMv2Hash(ntlmhash, username, targetName), hmac = crypto.createHmac('md5', ntlm2hash);
    //the first 8 bytes are spare to store the hashed value before the blob
    //server challenge
    type2message.challenge.copy(buf, 8);
    //blob signature
    buf.writeUInt32BE(0x01010000, 16);
    //reserved
    buf.writeUInt32LE(0, 20);
    //timestamp
    //TODO: we are loosing precision here since js is not able to handle those large integers
    // maybe think about a different solution here
    // 11644473600000 = diff between 1970 and 1601
    var timestamp = ((Date.now() + 11644473600000) * 10000).toString(16);
    var timestampLow = Number('0x' + timestamp.substring(Math.max(0, timestamp.length - 8)));
    var timestampHigh = Number('0x' + timestamp.substring(0, Math.max(0, timestamp.length - 8)));
    buf.writeUInt32LE(timestampLow, 24, false);
    buf.writeUInt32LE(timestampHigh, 28, false);
    //random client nonce
    buf.write(nonce || createPseudoRandomValue(16), 32, 'hex');
    //zero
    buf.writeUInt32LE(0, 40);
    //complete target information block from type 2 message
    type2message.targetInfo.buffer.copy(buf, 44);
    //zero
    buf.writeUInt32LE(0, 44 + type2message.targetInfo.buffer.length);
    hmac.update(buf.slice(8));
    var hashedBuffer = hmac.digest();
    hashedBuffer.copy(buf);
    return buf;
}
