export function take(patternOrChannel = '*', multicastPattern) {
  if (isDevelopment && arguments.length) {
    check(arguments[0], is.notUndef, 'take(patternOrChannel): patternOrChannel is undefined')
  }
  if (is.pattern(patternOrChannel)) {
    if (is.notUndef(multicastPattern)) {
      /* eslint-disable no-console */
      console.warn(
        `take(pattern) takes one argument but two were provided. Consider passing an array for listening to several action types`,
      )
    }
    return makeEffect(effectTypes.TAKE, { pattern: patternOrChannel })
  }
  if (is.multicast(patternOrChannel) && is.notUndef(multicastPattern) && is.pattern(multicastPattern)) {
    return makeEffect(effectTypes.TAKE, { channel: patternOrChannel, pattern: multicastPattern })
  }
  if (is.channel(patternOrChannel)) {
    if (is.notUndef(multicastPattern)) {
      /* eslint-disable no-console */
      console.warn(`take(channel) takes one argument but two were provided. Second argument is ignored.`)
    }
    return makeEffect(effectTypes.TAKE, { channel: patternOrChannel })
  }
  if (isDevelopment) {
    throw new Error(`take(patternOrChannel): argument ${patternOrChannel} is not valid channel or a valid pattern`)
  }
}
