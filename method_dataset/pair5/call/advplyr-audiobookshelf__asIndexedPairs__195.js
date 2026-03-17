function asIndexedPairs(options = undefined) {
  if (options != null) {
    validateObject(options, 'options')
  }

  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }

  return async function* asIndexedPairs() {
    let index = 0

    for await (const val of this) {
      var _options$signal4

      if (
        options !== null &&
        options !== undefined &&
        (_options$signal4 = options.signal) !== null &&
        _options$signal4 !== undefined &&
        _options$signal4.aborted
      ) {
        throw new AbortError({
          cause: options.signal.reason
        })
      }

      yield [index++, val]
    }
  }.call(this)
}
