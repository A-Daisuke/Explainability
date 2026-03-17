function map(fn, options) {
  if (typeof fn !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('fn', ['Function', 'AsyncFunction'], fn)
  }

  if (options != null) {
    validateObject(options, 'options')
  }

  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }

  let concurrency = 1

  if ((options === null || options === undefined ? undefined : options.concurrency) != null) {
    concurrency = MathFloor(options.concurrency)
  }

  validateInteger(concurrency, 'concurrency', 1)
  return async function* map() {
    var _options$signal, _options$signal2

    const ac = new AbortController()
    const stream = this
    const queue = []
    const signal = ac.signal
    const signalOpt = {
      signal
    }

    const abort = () => ac.abort()

    if (
      options !== null &&
      options !== undefined &&
      (_options$signal = options.signal) !== null &&
      _options$signal !== undefined &&
      _options$signal.aborted
    ) {
      abort()
    }

    options === null || options === undefined
      ? undefined
      : (_options$signal2 = options.signal) === null || _options$signal2 === undefined
        ? undefined
        : _options$signal2.addEventListener('abort', abort)
    let next
    let resume
    let done = false

    function onDone() {
      done = true
    }

    async function pump() {
      try {
        for await (let val of stream) {
          var _val

          if (done) {
            return
          }

          if (signal.aborted) {
            throw new AbortError()
          }

          try {
            val = fn(val, signalOpt)
          } catch (err) {
            val = PromiseReject(err)
          }

          if (val === kEmpty) {
            continue
          }

          if (typeof ((_val = val) === null || _val === undefined ? undefined : _val.catch) === 'function') {
            val.catch(onDone)
          }

          queue.push(val)

          if (next) {
            next()
            next = null
          }

          if (!done && queue.length && queue.length >= concurrency) {
            await new Promise((resolve) => {
              resume = resolve
            })
          }
        }

        queue.push(kEof)
      } catch (err) {
        const val = PromiseReject(err)
        PromisePrototypeCatch(val, onDone)
        queue.push(val)
      } finally {
        var _options$signal3

        done = true

        if (next) {
          next()
          next = null
        }

        options === null || options === undefined
          ? undefined
          : (_options$signal3 = options.signal) === null || _options$signal3 === undefined
            ? undefined
            : _options$signal3.removeEventListener('abort', abort)
      }
    }

    pump()

    try {
      while (true) {
        while (queue.length > 0) {
          const val = await queue[0]

          if (val === kEof) {
            return
          }

          if (signal.aborted) {
            throw new AbortError()
          }

          if (val !== kEmpty) {
            yield val
          }

          queue.shift()

          if (resume) {
            resume()
            resume = null
          }
        }

        await new Promise((resolve) => {
          next = resolve
        })
      }
    } finally {
      ac.abort()
      done = true

      if (resume) {
        resume()
        resume = null
      }
    }
  }.call(this)
}
