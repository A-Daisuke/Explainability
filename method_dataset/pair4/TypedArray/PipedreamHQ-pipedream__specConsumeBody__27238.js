async function specConsumeBody (object, convertBytesToJSValue, instance) {
  webidl.brandCheck(object, instance)

  throwIfAborted(object[kState])

  // 1. If object is unusable, then return a promise rejected
  //    with a TypeError.
  if (bodyUnusable(object[kState].body)) {
    throw new TypeError('Body is unusable')
  }

  // 2. Let promise be a new promise.
  const promise = createDeferredPromise()

  // 3. Let errorSteps given error be to reject promise with error.
  const errorSteps = (error) => promise.reject(error)

  // 4. Let successSteps given a byte sequence data be to resolve
  //    promise with the result of running convertBytesToJSValue
  //    with data. If that threw an exception, then run errorSteps
  //    with that exception.
  const successSteps = (data) => {
    try {
      promise.resolve(convertBytesToJSValue(data))
    } catch (e) {
      errorSteps(e)
    }
  }

  // 5. If object’s body is null, then run successSteps with an
  //    empty byte sequence.
  if (object[kState].body == null) {
    successSteps(new Uint8Array())
    return promise.promise
  }

  // 6. Otherwise, fully read object’s body given successSteps,
  //    errorSteps, and object’s relevant global object.
  await fullyReadBody(object[kState].body, successSteps, errorSteps)

  // 7. Return promise.
  return promise.promise
}
