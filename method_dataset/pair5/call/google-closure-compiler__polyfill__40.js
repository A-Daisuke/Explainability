  var polyfill = function(arrayLike, opt_mapFn, opt_thisArg) {
    opt_mapFn = opt_mapFn != null ? opt_mapFn : function(x) { return x; };
    var result = [];
    // NOTE: this is cast to ? because [] on @struct is an error
    var iteratorFunction = typeof Symbol != 'undefined' && Symbol.iterator &&
        (/** @type {?} */ (arrayLike)[Symbol.iterator]);
    if (typeof iteratorFunction == 'function') {
      arrayLike = iteratorFunction.call(arrayLike);
      var next;
      var k = 0;
      while (!(next = arrayLike.next()).done) {
        result.push(
            opt_mapFn.call(/** @type {?} */ (opt_thisArg), next.value, k++));
      }
    } else {
      var len = arrayLike.length;  // need to support non-iterables
      for (var i = 0; i < len; i++) {
        result.push(
            opt_mapFn.call(/** @type {?} */ (opt_thisArg), arrayLike[i], i));
      }
    }
    return result;
  };
