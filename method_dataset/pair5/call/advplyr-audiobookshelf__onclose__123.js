  const onclose = () => {
    closed = true
    const errored = isWritableErrored(stream) || isReadableErrored(stream)

    if (errored && typeof errored !== 'boolean') {
      return callback.call(stream, errored)
    }

    if (readable && !readableFinished && isReadableNodeStream(stream, true)) {
      if (!isReadableFinished(stream, false)) return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE())
    }

    if (writable && !writableFinished) {
      if (!isWritableFinished(stream, false)) return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE())
    }

    callback.call(stream)
  }
