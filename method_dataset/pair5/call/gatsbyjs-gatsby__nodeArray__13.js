function nodeArray(input) {
  if (!input) {
    return []
  }

  if (Array.isArray(input)) {
    return input
  }

  // instanceof Node - does not work with iframes
  if (input.nodeType !== undefined) {
    return [input]
  }

  if (typeof input === 'string') {
    input = document.querySelectorAll(input)
  }

  if (input.length !== undefined) {
    return [].slice.call(input, 0)
  }

  throw new TypeError('unexpected input ' + String(input))
}
