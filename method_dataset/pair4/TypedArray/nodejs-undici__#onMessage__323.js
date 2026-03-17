function __method_wrapper__() {
  #onMessage (type, data) {
    // 1. If stream’s ready state is not OPEN (1), then return.
    if (this.#handler.readyState !== states.OPEN) {
      return
    }

    // 2. Let chunk be determined by switching on type:
    //      - type indicates that the data is Text
    //          a new DOMString containing data
    //      - type indicates that the data is Binary
    //          a new Uint8Array object, created in the relevant Realm of the
    //          WebSocketStream object, whose contents are data
    let chunk

    if (type === opcodes.TEXT) {
      try {
        chunk = utf8Decode(data)
      } catch {
        failWebsocketConnection(this.#handler, 'Received invalid UTF-8 in text frame.')
        return
      }
    } else if (type === opcodes.BINARY) {
      chunk = new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
    }

    // 3. Enqueue chunk into stream’s readable stream.
    this.#readableStreamController.enqueue(chunk)

    // 4. Apply backpressure to the WebSocket.
  }

}
