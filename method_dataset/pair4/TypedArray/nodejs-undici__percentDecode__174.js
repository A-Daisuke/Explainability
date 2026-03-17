function percentDecode (input) {
  const length = input.length
  // 1. Let output be an empty byte sequence.
  /** @type {Uint8Array} */
  const output = new Uint8Array(length)
  let j = 0
  let i = 0
  // 2. For each byte byte in input:
  while (i < length) {
    const byte = input[i]

    // 1. If byte is not 0x25 (%), then append byte to output.
    if (byte !== 0x25) {
      output[j++] = byte

    // 2. Otherwise, if byte is 0x25 (%) and the next two bytes
    // after byte in input are not in the ranges
    // 0x30 (0) to 0x39 (9), 0x41 (A) to 0x46 (F),
    // and 0x61 (a) to 0x66 (f), all inclusive, append byte
    // to output.
    } else if (
      byte === 0x25 &&
      !(isHexCharByte(input[i + 1]) && isHexCharByte(input[i + 2]))
    ) {
      output[j++] = 0x25

    // 3. Otherwise:
    } else {
      // 1. Let bytePoint be the two bytes after byte in input,
      // decoded, and then interpreted as hexadecimal number.
      // 2. Append a byte whose value is bytePoint to output.
      output[j++] = (hexByteToNumber(input[i + 1]) << 4) | hexByteToNumber(input[i + 2])

      // 3. Skip the next two bytes in input.
      i += 2
    }
    ++i
  }

  // 3. Return output.
  return length === j ? output : output.subarray(0, j)
}
