function processBlobParts (parts, options) {
  // 1. Let bytes be an empty sequence of bytes.
  /** @type {NodeJS.TypedArray[]} */
  const bytes = []

  // 2. For each element in parts:
  for (const element of parts) {
    // 1. If element is a USVString, run the following substeps:
    if (typeof element === 'string') {
      // 1. Let s be element.
      let s = element

      // 2. If the endings member of options is "native", set s
      //    to the result of converting line endings to native
      //    of element.
      if (options.endings === 'native') {
        s = convertLineEndingsNative(s)
      }

      // 3. Append the result of UTF-8 encoding s to bytes.
      bytes.push(encoder.encode(s))
    } else if (
      types.isAnyArrayBuffer(element) ||
      types.isTypedArray(element)
    ) {
      // 2. If element is a BufferSource, get a copy of the
      //    bytes held by the buffer source, and append those
      //    bytes to bytes.
      if (!element.buffer) { // ArrayBuffer
        bytes.push(new Uint8Array(element))
      } else {
        bytes.push(
          new Uint8Array(element.buffer, element.byteOffset, element.byteLength)
        )
      }
    } else if (isBlobLike(element)) {
      // 3. If element is a Blob, append the bytes it represents
      //    to bytes.
      bytes.push(element)
    }
  }

  // 3. Return bytes.
  return bytes
}
