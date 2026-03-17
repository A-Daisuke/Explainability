function extractBody (object, keepalive = false) {
  // 1. Let stream be null.
  let stream = null

  // 2. If object is a ReadableStream object, then set stream to object.
  if (webidl.is.ReadableStream(object)) {
    stream = object
  } else if (webidl.is.Blob(object)) {
    // 3. Otherwise, if object is a Blob object, set stream to the
    //    result of running object’s get stream.
    stream = object.stream()
  } else {
    // 4. Otherwise, set stream to a new ReadableStream object, and set
    //    up stream with byte reading support.
    stream = new ReadableStream({
      pull (controller) {
        const buffer = typeof source === 'string' ? textEncoder.encode(source) : source

        if (buffer.byteLength) {
          controller.enqueue(buffer)
        }

        queueMicrotask(() => readableStreamClose(controller))
      },
      start () {},
      type: 'bytes'
    })
  }

  // 5. Assert: stream is a ReadableStream object.
  assert(webidl.is.ReadableStream(stream))

  // 6. Let action be null.
  let action = null

  // 7. Let source be null.
  let source = null

  // 8. Let length be null.
  let length = null

  // 9. Let type be null.
  let type = null

  // 10. Switch on object:
  if (typeof object === 'string') {
    // Set source to the UTF-8 encoding of object.
    // Note: setting source to a Uint8Array here breaks some mocking assumptions.
    source = object

    // Set type to `text/plain;charset=UTF-8`.
    type = 'text/plain;charset=UTF-8'
  } else if (webidl.is.URLSearchParams(object)) {
    // URLSearchParams

    // spec says to run application/x-www-form-urlencoded on body.list
    // this is implemented in Node.js as apart of an URLSearchParams instance toString method
    // See: https://github.com/nodejs/node/blob/e46c680bf2b211bbd52cf959ca17ee98c7f657f5/lib/internal/url.js#L490
    // and https://github.com/nodejs/node/blob/e46c680bf2b211bbd52cf959ca17ee98c7f657f5/lib/internal/url.js#L1100

    // Set source to the result of running the application/x-www-form-urlencoded serializer with object’s list.
    source = object.toString()

    // Set type to `application/x-www-form-urlencoded;charset=UTF-8`.
    type = 'application/x-www-form-urlencoded;charset=UTF-8'
  } else if (webidl.is.BufferSource(object)) {
    source = isArrayBuffer(object)
      ? new Uint8Array(object.slice())
      : new Uint8Array(object.buffer.slice(object.byteOffset, object.byteOffset + object.byteLength))
  } else if (webidl.is.FormData(object)) {
    const boundary = `----formdata-undici-0${`${random(1e11)}`.padStart(11, '0')}`
    const prefix = `--${boundary}\r\nContent-Disposition: form-data`

    /*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
    const formdataEscape = (str) =>
      str.replace(/\n/g, '%0A').replace(/\r/g, '%0D').replace(/"/g, '%22')
    const normalizeLinefeeds = (value) => value.replace(/\r?\n|\r/g, '\r\n')

    // Set action to this step: run the multipart/form-data
    // encoding algorithm, with object’s entry list and UTF-8.
    // - This ensures that the body is immutable and can't be changed afterwords
    // - That the content-length is calculated in advance.
    // - And that all parts are pre-encoded and ready to be sent.

    const blobParts = []
    const rn = new Uint8Array([13, 10]) // '\r\n'
    length = 0
    let hasUnknownSizeValue = false

    for (const [name, value] of object) {
      if (typeof value === 'string') {
        const chunk = textEncoder.encode(prefix +
          `; name="${formdataEscape(normalizeLinefeeds(name))}"` +
          `\r\n\r\n${normalizeLinefeeds(value)}\r\n`)
        blobParts.push(chunk)
        length += chunk.byteLength
      } else {
        const chunk = textEncoder.encode(`${prefix}; name="${formdataEscape(normalizeLinefeeds(name))}"` +
          (value.name ? `; filename="${formdataEscape(value.name)}"` : '') + '\r\n' +
          `Content-Type: ${
            value.type || 'application/octet-stream'
          }\r\n\r\n`)
        blobParts.push(chunk, value, rn)
        if (typeof value.size === 'number') {
          length += chunk.byteLength + value.size + rn.byteLength
        } else {
          hasUnknownSizeValue = true
        }
      }
    }

    // CRLF is appended to the body to function with legacy servers and match other implementations.
    // https://github.com/curl/curl/blob/3434c6b46e682452973972e8313613dfa58cd690/lib/mime.c#L1029-L1030
    // https://github.com/form-data/form-data/issues/63
    const chunk = textEncoder.encode(`--${boundary}--\r\n`)
    blobParts.push(chunk)
    length += chunk.byteLength
    if (hasUnknownSizeValue) {
      length = null
    }

    // Set source to object.
    source = object

    action = async function * () {
      for (const part of blobParts) {
        if (part.stream) {
          yield * part.stream()
        } else {
          yield part
        }
      }
    }

    // Set type to `multipart/form-data; boundary=`,
    // followed by the multipart/form-data boundary string generated
    // by the multipart/form-data encoding algorithm.
    type = `multipart/form-data; boundary=${boundary}`
  } else if (webidl.is.Blob(object)) {
    // Blob

    // Set source to object.
    source = object

    // Set length to object’s size.
    length = object.size

    // If object’s type attribute is not the empty byte sequence, set
    // type to its value.
    if (object.type) {
      type = object.type
    }
  } else if (typeof object[Symbol.asyncIterator] === 'function') {
    // If keepalive is true, then throw a TypeError.
    if (keepalive) {
      throw new TypeError('keepalive')
    }

    // If object is disturbed or locked, then throw a TypeError.
    if (util.isDisturbed(object) || object.locked) {
      throw new TypeError(
        'Response body object should not be disturbed or locked'
      )
    }

    stream =
      webidl.is.ReadableStream(object) ? object : ReadableStreamFrom(object)
  }

  // 11. If source is a byte sequence, then set action to a
  // step that returns source and length to source’s length.
  if (typeof source === 'string' || util.isBuffer(source)) {
    length = Buffer.byteLength(source)
  }

  // 12. If action is non-null, then run these steps in in parallel:
  if (action != null) {
    // Run action.
    let iterator
    stream = new ReadableStream({
      start () {
        iterator = action(object)[Symbol.asyncIterator]()
      },
      pull (controller) {
        return iterator.next().then(({ value, done }) => {
          if (done) {
            // When running action is done, close stream.
            queueMicrotask(() => {
              controller.close()
              controller.byobRequest?.respond(0)
            })
          } else {
            // Whenever one or more bytes are available and stream is not errored,
            // enqueue a Uint8Array wrapping an ArrayBuffer containing the available
            // bytes into stream.
            if (!isErrored(stream)) {
              const buffer = new Uint8Array(value)
              if (buffer.byteLength) {
                controller.enqueue(buffer)
              }
            }
          }
          return controller.desiredSize > 0
        })
      },
      cancel (reason) {
        return iterator.return()
      },
      type: 'bytes'
    })
  }

  // 13. Let body be a body whose stream is stream, source is source,
  // and length is length.
  const body = { stream, source, length }

  // 14. Return (body, type).
  return [body, type]
}
