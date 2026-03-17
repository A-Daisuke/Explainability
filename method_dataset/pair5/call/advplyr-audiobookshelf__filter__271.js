function filter(fn, options) {
  if (typeof fn !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('fn', ['Function', 'AsyncFunction'], fn)
  }

  async function filterFn(value, options) {
    if (await fn(value, options)) {
      return value
    }

    return kEmpty
  }

  return map.call(this, filterFn, options)
} // Specific to provide better error to reduce since the argument is only
