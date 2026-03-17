function __method_wrapper__() {
  modifiers.forEach(function (token) {
    if (token === '*') {
      // we've already covered the all-in operator
      return
    }

    // we want the modifier pressed
    var value = true
    var operator = token.slice(0, 1)
    if (operator === '?') {
      // we don't care if the modifier is pressed
      value = null
    } else if (operator === '!') {
      // we do not want the modifier pressed
      value = false
    }

    if (value !== true) {
      // compensate for the modifier's operator
      token = token.slice(1)
    }

    var propertyName = modifier[token]
    if (!propertyName) {
      throw new TypeError('Unknown modifier "' + token + '"')
    }

    expected[propertyName] = value
  })

}
