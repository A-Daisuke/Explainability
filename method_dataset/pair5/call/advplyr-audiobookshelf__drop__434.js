function drop(number, options = undefined) {
  if (options != null) {
    validateObject(options, 'options')
  }

  if ((options === null || options === undefined ? undefined : options.signal) != null) {
    validateAbortSignal(options.signal, 'options.signal')
  }

  number = toIntegerOrInfinity(number)
  return async function* drop() {
    var _options$signal8

    if (
      options !== null &&
      options !== undefined &&
      (_options$signal8 = options.signal) !== null &&
      _options$signal8 !== undefined &&
      _options$signal8.aborted
    ) {
      throw new AbortError()
    }

    for await (const val of this) {
      var _options$signal9

      if (
        options !== null &&
        options !== undefined &&
        (_options$signal9 = options.signal) !== null &&
        _options$signal9 !== undefined &&
        _options$signal9.aborted
      ) {
        throw new AbortError()
      }

      if (number-- <= 0) {
        yield val
      }
    }
  }.call(this)
}
