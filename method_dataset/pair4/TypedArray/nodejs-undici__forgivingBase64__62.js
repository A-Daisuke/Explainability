function forgivingBase64 (data) {
  // 1. Remove all ASCII whitespace from data.
  data = data.replace(ASCII_WHITESPACE_REPLACE_REGEX, '')

  let dataLength = data.length
  // 2. If data’s code point length divides by 4 leaving
  // no remainder, then:
  if (dataLength % 4 === 0) {
    // 1. If data ends with one or two U+003D (=) code points,
    // then remove them from data.
    if (data.charCodeAt(dataLength - 1) === 0x003D) {
      --dataLength
      if (data.charCodeAt(dataLength - 1) === 0x003D) {
        --dataLength
      }
    }
  }

  // 3. If data’s code point length divides by 4 leaving
  // a remainder of 1, then return failure.
  if (dataLength % 4 === 1) {
    return 'failure'
  }

  // 4. If data contains a code point that is not one of
  //  U+002B (+)
  //  U+002F (/)
  //  ASCII alphanumeric
  // then return failure.
  if (/[^+/0-9A-Za-z]/.test(data.length === dataLength ? data : data.substring(0, dataLength))) {
    return 'failure'
  }

  const buffer = Buffer.from(data, 'base64')
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
}
