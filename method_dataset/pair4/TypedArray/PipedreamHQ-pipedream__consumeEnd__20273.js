function consumeEnd (consume) {
  const { type, body, resolve, stream, length } = consume

  try {
    if (type === 'text') {
      resolve(toUSVString(Buffer.concat(body)))
    } else if (type === 'json') {
      resolve(JSON.parse(Buffer.concat(body)))
    } else if (type === 'arrayBuffer') {
      const dst = new Uint8Array(length)

      let pos = 0
      for (const buf of body) {
        dst.set(buf, pos)
        pos += buf.byteLength
      }

      resolve(dst.buffer)
    } else if (type === 'blob') {
      if (!Blob) {
        Blob = (__nccwpck_require__(4300).Blob)
      }
      resolve(new Blob(body, { type: stream[kContentType] }))
    }

    consumeFinish(consume)
  } catch (err) {
    stream.destroy(err)
  }
}
