function take(number, options = undefined) {
  if (options != null) {
    validateObject(options, 'options')
  }

  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }

  number = toIntegerOrInfinity(number)
  return async function* take() {
    var _options$signal10

    if (
      options !== null &&
      options !== undefined &&
      (_options$signal10 = options.signal) !== null &&
      _options$signal10 !== undefined &&
      _options$signal10.aborted
    ) {
      throw new AbortError()
    }

    for await (const val of this) {
      var _options$signal11

      if (
        options !== null &&
        options !== undefined &&
        (_options$signal11 = options.signal) !== null &&
        _options$signal11 !== undefined &&
        _options$signal11.aborted
      ) {
        throw new AbortError()
      }

      if (number-- > 0) {
        yield val
      } else {
        return
      }
    }
  }.call(this)
}
