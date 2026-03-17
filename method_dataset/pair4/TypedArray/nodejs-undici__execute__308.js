function __method_wrapper__() {
  execute (chunk) {
    assert(currentParser === null)
    assert(this.ptr != null)
    assert(!this.paused)

    const { socket, llhttp } = this

    // Allocate a new buffer if the current buffer is too small.
    if (chunk.length > currentBufferSize) {
      if (currentBufferPtr) {
        llhttp.free(currentBufferPtr)
      }
      // Allocate a buffer that is a multiple of 4096 bytes.
      currentBufferSize = Math.ceil(chunk.length / 4096) * 4096
      currentBufferPtr = llhttp.malloc(currentBufferSize)
    }

    new Uint8Array(llhttp.memory.buffer, currentBufferPtr, currentBufferSize).set(chunk)

    // Call `execute` on the wasm parser.
    // We pass the `llhttp_parser` pointer address, the pointer address of buffer view data,
    // and finally the length of bytes to parse.
    // The return value is an error code or `constants.ERROR.OK`.
    try {
      let ret

      try {
        currentBufferRef = chunk
        currentParser = this
        ret = llhttp.llhttp_execute(this.ptr, currentBufferPtr, chunk.length)
      } finally {
        currentParser = null
        currentBufferRef = null
      }

      if (ret !== constants.ERROR.OK) {
        const data = chunk.subarray(llhttp.llhttp_get_error_pos(this.ptr) - currentBufferPtr)

        if (ret === constants.ERROR.PAUSED_UPGRADE) {
          this.onUpgrade(data)
        } else if (ret === constants.ERROR.PAUSED) {
          this.paused = true
          socket.unshift(data)
        } else {
          const ptr = llhttp.llhttp_get_error_reason(this.ptr)
          let message = ''
          if (ptr) {
            const len = new Uint8Array(llhttp.memory.buffer, ptr).indexOf(0)
            message =
              'Response does not match the HTTP/1.1 protocol (' +
              Buffer.from(llhttp.memory.buffer, ptr, len).toString() +
              ')'
          }
          throw new HTTPParserError(message, constants.ERROR[ret], data)
        }
      }
    } catch (err) {
      util.destroy(socket, err)
    }
  }

}
