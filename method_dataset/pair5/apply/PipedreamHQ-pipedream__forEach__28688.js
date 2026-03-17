function __method_wrapper__() {
  forEach (callbackFn, thisArg = globalThis) {
    webidl.brandCheck(this, FormData)

    webidl.argumentLengthCheck(arguments, 1, { header: 'FormData.forEach' })

    if (typeof callbackFn !== 'function') {
      throw new TypeError(
        "Failed to execute 'forEach' on 'FormData': parameter 1 is not of type 'Function'."
      )
    }

    for (const [key, value] of this) {
      callbackFn.apply(thisArg, [value, key, this])
    }
  }

}
