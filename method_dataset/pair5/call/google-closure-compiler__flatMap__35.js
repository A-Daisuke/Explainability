  var flatMap = function(callback, thisArg) {
    var mapped = [];
    var mapAndFlattenElementIntoArray = function(element, index) {
      var result = callback.call(thisArg, element, index, this);
      if (Array.isArray(result)) {
        mapped.push.apply(mapped, result);
      } else {
        // NOTE: The specification says the callback can return a non-Array.
        // We intentionally don't include that in the type information on
        // this function or the corresponding extern in order to encourage
        // more readable code and avoid complex TTL in the type annotations,
        // but we still want to behave correctly if the callback gives us a
        // non-Array.
        mapped.push(result);
      }
    };
    // Use Array.prototype explicitly since IE11 doesn't support forEach
    // on array-like NodeList
    Array.prototype.forEach.call(this, mapAndFlattenElementIntoArray);
    return mapped;
  };
