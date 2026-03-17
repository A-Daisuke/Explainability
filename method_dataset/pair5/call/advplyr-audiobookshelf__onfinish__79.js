  const onfinish = () => {
    writableFinished = true // Stream should not be destroyed here. If it is that
    // means that user space is doing something differently and
    // we cannot trust willEmitClose.

    if (stream.destroyed) {
      willEmitClose = false
    }

    if (willEmitClose && (!stream.readable || readable)) {
      return
    }

    if (!readable || readableFinished) {
      callback.call(stream)
    }
  }
