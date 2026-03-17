function wrapRequestBody (body) {
  if (isStream(body)) {
    // TODO (fix): Provide some way for the user to cache the file to e.g. /tmp
    // so that it can be dispatched again?
    // TODO (fix): Do we need 100-expect support to provide a way to do this properly?
    if (bodyLength(body) === 0) {
      body
        .on('data', function () {
          assert(false)
        })
    }

    if (typeof body.readableDidRead !== 'boolean') {
      body[kBodyUsed] = false
      EE.prototype.on.call(body, 'data', function () {
        this[kBodyUsed] = true
      })
    }

    return body
  } else if (body && typeof body.pipeTo === 'function') {
    // TODO (fix): We can't access ReadableStream internal state
    // to determine whether or not it has been disturbed. This is just
    // a workaround.
    return new BodyAsyncIterable(body)
  } else if (
    body &&
    typeof body !== 'string' &&
    !ArrayBuffer.isView(body) &&
    isIterable(body)
  ) {
    // TODO: Should we allow re-using iterable if !this.opts.idempotent
    // or through some other flag?
    return new BodyAsyncIterable(body)
  } else {
    return body
  }
}
