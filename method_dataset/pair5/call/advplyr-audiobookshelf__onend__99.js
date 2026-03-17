  const onend = () => {
    readableFinished = true // Stream should not be destroyed here. If it is that
    // means that user space is doing something differently and
    // we cannot trust willEmitClose.

    if (stream.destroyed) {
      willEmitClose = false
    }

    if (willEmitClose && (!stream.writable || writable)) {
      return
    }

    if (!writable || writableFinished) {
      callback.call(stream)
    }
  }
