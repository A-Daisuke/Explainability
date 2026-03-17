function __method_wrapper__() {
  #write (chunk) {
    // See /websockets/stream/tentative/write.any.html
    chunk = webidl.converters.WebSocketStreamWrite(chunk)

    // 1. Let promise be a new promise created in stream ’s relevant realm .
    const promise = createDeferredPromise()

    // 2. Let data be null.
    let data = null

    // 3. Let opcode be null.
    let opcode = null

    // 4. If chunk is a BufferSource ,
    if (webidl.is.BufferSource(chunk)) {
      // 4.1. Set data to a copy of the bytes given chunk .
      data = new Uint8Array(ArrayBuffer.isView(chunk) ? new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength) : chunk.slice())

      // 4.2. Set opcode to a binary frame opcode.
      opcode = opcodes.BINARY
    } else {
      // 5. Otherwise,

      // 5.1. Let string be the result of converting chunk to an IDL USVString .
      //    If this throws an exception, return a promise rejected with the exception.
      let string

      try {
        string = webidl.converters.DOMString(chunk)
      } catch (e) {
        promise.reject(e)
        return promise.promise
      }

      // 5.2. Set data to the result of UTF-8 encoding string .
      data = new TextEncoder().encode(string)

      // 5.3. Set opcode to a text frame opcode.
      opcode = opcodes.TEXT
    }

    // 6. In parallel,
    // 6.1. Wait until there is sufficient buffer space in stream to send the message.

    // 6.2. If the closing handshake has not yet started , Send a WebSocket Message to stream comprised of data using opcode .
    if (!this.#handler.closeState.has(sentCloseFrameState.SENT) && !this.#handler.closeState.has(sentCloseFrameState.RECEIVED)) {
      const frame = new WebsocketFrameSend(data)

      this.#handler.socket.write(frame.createFrame(opcode), () => {
        promise.resolve(undefined)
      })
    }

    // 6.3. Queue a global task on the WebSocket task source given stream ’s relevant global object to resolve promise with undefined.
    return promise.promise
  }

}
