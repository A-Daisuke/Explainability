function pipelineImpl(streams, callback, opts) {
  if (streams.length === 1 && ArrayIsArray(streams[0])) {
    streams = streams[0]
  }

  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams')
  }

  const ac = new AbortController()
  const signal = ac.signal
  const outerSignal = opts === null || opts === undefined ? undefined : opts.signal // Need to cleanup event listeners if last stream is readable
  // https://github.com/nodejs/node/issues/35452

  const lastStreamCleanup = []
  validateAbortSignal(outerSignal, 'options.signal')

  function abort() {
    finishImpl(new AbortError())
  }

  outerSignal === null || outerSignal === undefined ? undefined : outerSignal.addEventListener('abort', abort)
  let error
  let value
  const destroys = []
  let finishCount = 0

  function finish(err) {
    finishImpl(err, --finishCount === 0)
  }

  function finishImpl(err, final) {
    if (err && (!error || error.code === 'ERR_STREAM_PREMATURE_CLOSE')) {
      error = err
    }

    if (!error && !final) {
      return
    }

    while (destroys.length) {
      destroys.shift()(error)
    }

    outerSignal === null || outerSignal === undefined ? undefined : outerSignal.removeEventListener('abort', abort)
    ac.abort()

    if (final) {
      if (!error) {
        lastStreamCleanup.forEach((fn) => fn())
      }

      process.nextTick(callback, error, value)
    }
  }

  let ret

  for (let i = 0; i < streams.length; i++) {
    const stream = streams[i]
    const reading = i < streams.length - 1
    const writing = i > 0
    const end = reading || (opts === null || opts === undefined ? undefined : opts.end) !== false
    const isLastStream = i === streams.length - 1

    if (isNodeStream(stream)) {
      if (end) {
        const { destroy, cleanup } = destroyer(stream, reading, writing)
        destroys.push(destroy)

        if (isReadable(stream) && isLastStream) {
          lastStreamCleanup.push(cleanup)
        }
      } // Catch stream errors that occur after pipe/pump has completed.

      function onError(err) {
        if (err && err.name !== 'AbortError' && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
          finish(err)
        }
      }

      stream.on('error', onError)

      if (isReadable(stream) && isLastStream) {
        lastStreamCleanup.push(() => {
          stream.removeListener('error', onError)
        })
      }
    }

    if (i === 0) {
      if (typeof stream === 'function') {
        ret = stream({
          signal
        })

        if (!isIterable(ret)) {
          throw new ERR_INVALID_RETURN_VALUE('Iterable, AsyncIterable or Stream', 'source', ret)
        }
      } else if (isIterable(stream) || isReadableNodeStream(stream)) {
        ret = stream
      } else {
        ret = Duplex.from(stream)
      }
    } else if (typeof stream === 'function') {
      ret = makeAsyncIterable(ret)
      ret = stream(ret, {
        signal
      })

      if (reading) {
        if (!isIterable(ret, true)) {
          throw new ERR_INVALID_RETURN_VALUE('AsyncIterable', `transform[${i - 1}]`, ret)
        }
      } else {
        var _ret

        if (!PassThrough) {
          PassThrough = require('./passthrough')
        } // If the last argument to pipeline is not a stream
        // we must create a proxy stream so that pipeline(...)
        // always returns a stream which can be further
        // composed through `.pipe(stream)`.

        const pt = new PassThrough({
          objectMode: true
        }) // Handle Promises/A+ spec, `then` could be a getter that throws on
        // second use.

        const then = (_ret = ret) === null || _ret === undefined ? undefined : _ret.then

        if (typeof then === 'function') {
          finishCount++
          then.call(
            ret,
            (val) => {
              value = val

              if (val != null) {
                pt.write(val)
              }

              if (end) {
                pt.end()
              }

              process.nextTick(finish)
            },
            (err) => {
              pt.destroy(err)
              process.nextTick(finish, err)
            }
          )
        } else if (isIterable(ret, true)) {
          finishCount++
          pump(ret, pt, finish, {
            end
          })
        } else {
          throw new ERR_INVALID_RETURN_VALUE('AsyncIterable or Promise', 'destination', ret)
        }

        ret = pt
        const { destroy, cleanup } = destroyer(ret, false, true)
        destroys.push(destroy)

        if (isLastStream) {
          lastStreamCleanup.push(cleanup)
        }
      }
    } else if (isNodeStream(stream)) {
      if (isReadableNodeStream(ret)) {
        finishCount += 2
        const cleanup = pipe(ret, stream, finish, {
          end
        })

        if (isReadable(stream) && isLastStream) {
          lastStreamCleanup.push(cleanup)
        }
      } else if (isIterable(ret)) {
        finishCount++
        pump(ret, stream, finish, {
          end
        })
      } else {
        throw new ERR_INVALID_ARG_TYPE('val', ['Readable', 'Iterable', 'AsyncIterable'], ret)
      }

      ret = stream
    } else {
      ret = Duplex.from(stream)
    }
  }

  if (
    (signal !== null && signal !== undefined && signal.aborted) ||
    (outerSignal !== null && outerSignal !== undefined && outerSignal.aborted)
  ) {
    process.nextTick(abort)
  }

  return ret
}
