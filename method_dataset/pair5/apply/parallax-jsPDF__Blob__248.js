  function Blob(chunks, opts) {
    chunks = chunks || [];
    for (var i = 0, len = chunks.length; i < len; i++) {
      var chunk = chunks[i];
      if (chunk instanceof Blob) {
        chunks[i] = chunk._buffer;
      } else if (typeof chunk === "string") {
        chunks[i] = toUTF8Array(chunk);
      } else if (
        arrayBufferSupported &&
        (ArrayBuffer.prototype.isPrototypeOf(chunk) || isArrayBufferView(chunk))
      ) {
        chunks[i] = bufferClone(chunk);
      } else if (arrayBufferSupported && isDataView(chunk)) {
        chunks[i] = bufferClone(chunk.buffer);
      } else {
        chunks[i] = toUTF8Array(String(chunk));
      }
    }

    this._buffer = [].concat.apply([], chunks);
    this.size = this._buffer.length;
    this.type = opts ? opts.type || "" : "";
  }
