function forgivingBase64 (data) {
  // 1. Remove all ASCII whitespace from data.
  data = data.replace(/[\u0009\u000A\u000C\u000D\u0020]/g, '')  // eslint-disable-line

  // 2. If data’s code point length divides by 4 leaving
  // no remainder, then:
  if (data.length % 4 === 0) {
    // 1. If data ends with one or two U+003D (=) code points,
    // then remove them from data.
    data = data.replace(/=?=$/, '')
  }

  // 3. If data’s code point length divides by 4 leaving
  // a remainder of 1, then return failure.
  if (data.length % 4 === 1) {
    return 'failure'
  }

  // 4. If data contains a code point that is not one of
  //  U+002B (+)
  //  U+002F (/)
  //  ASCII alphanumeric
  // then return failure.
  if (/[^+/0-9A-Za-z]/.test(data)) {
    return 'failure'
  }

  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)

  for (let byte = 0; byte < binary.length; byte++) {
    bytes[byte] = binary.charCodeAt(byte)
  }

  return bytes
}
