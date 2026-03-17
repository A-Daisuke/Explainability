  function fromEntries(iter) {
    var obj = {};

    if (!(Symbol.iterator in iter)) {
      throw new TypeError('' + iter + ' is not iterable');
    }

    var iteratorFn = (/** @type {function(): !Iterator<!Object<number, *>>} */ (
        iter[Symbol.iterator]));
    var iterator = iteratorFn.call(iter);

    for (var result = iterator.next(); !result.done; result = iterator.next()) {
      var pair = result.value;

      if (Object(pair) !== pair) {
        throw new TypeError('iterable for fromEntries should yield objects');
      }

      var key = pair[0];
      var val = pair[1];
      obj[key] = val;
    }

    return obj;
  }
