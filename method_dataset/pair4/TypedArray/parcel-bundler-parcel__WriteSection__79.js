function WriteSection(name, value, valLenOverride) {
  const nameBuf = str2ab(name);
  const valBuf = str2ab(value);
  const nameLen = encode_uint(nameBuf.length);
  const valLen = encode_uint(valLenOverride ?? valBuf.length);
  const sectionLenDeclared =
    nameLen.length +
    nameBuf.length +
    valLen.length +
    (valLenOverride ?? valBuf.length);
  const sectionLenActual =
    nameLen.length + nameBuf.length + valLen.length + valBuf.length;
  const headerLen = encode_uint(sectionLenDeclared);
  let bytes = new Uint8Array(sectionLenActual + headerLen.length + 1);
  let pos = 1;
  bytes.set(headerLen, pos);
  pos += headerLen.length;
  bytes.set(nameLen, pos);
  pos += nameLen.length;
  bytes.set(nameBuf, pos);
  pos += nameBuf.length;
  const val_start = pos;
  bytes.set(valLen, pos);
  pos += valLen.length;
  bytes.set(valBuf, pos);
  return bytes;
}
