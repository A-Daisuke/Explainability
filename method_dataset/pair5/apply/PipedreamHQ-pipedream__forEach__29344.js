function __method_wrapper__() {
  forEach (callbackFn, thisArg = globalThis) {
    webidl.brandCheck(this, Headers)

    webidl.argumentLengthCheck(arguments, 1, { header: 'Headers.forEach' })

    if (typeof callbackFn !== 'function') {
      throw new TypeError(
        "Failed to execute 'forEach' on 'Headers': parameter 1 is not of type 'Function'."
      )
    }

    for (const [key, value] of this) {
      callbackFn.apply(thisArg, [value, key, this])
    }
  }

}
