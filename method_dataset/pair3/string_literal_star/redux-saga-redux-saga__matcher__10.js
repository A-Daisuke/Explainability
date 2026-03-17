export default function matcher(pattern) {
  // prettier-ignore
  const matcherCreator = (
      pattern === '*'            ? wildcard
    : is.string(pattern)         ? string
    : is.array(pattern)          ? array
    : is.stringableFunc(pattern) ? string
    : is.func(pattern)           ? predicate
    : is.symbol(pattern)         ? symbol
    : null
  )

  if (matcherCreator === null) {
    throw new Error(`invalid pattern: ${pattern}`)
  }

  return matcherCreator(pattern)
}
