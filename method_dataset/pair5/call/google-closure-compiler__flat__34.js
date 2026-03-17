  var flat = function(depth) {
    // TODO(sdh): Consider respecting Symbol.species (b/121061255).
    depth = depth === undefined ? 1 : depth;
    var flattened = [];
    var flattenElementIntoArray = function(element) {
      if (Array.isArray(element) && depth > 0) {
        var inner = Array.prototype.flat.call(element, depth - 1);
        flattened.push.apply(flattened, inner);
      } else {
        flattened.push(element);
      }
    };
    // Use Array.prototype explicitly since IE11 doesn't support forEach
    // on array-like NodeList
    Array.prototype.forEach.call(this, flattenElementIntoArray);
    return flattened;
  };
