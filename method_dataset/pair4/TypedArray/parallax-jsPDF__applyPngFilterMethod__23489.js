  function applyPngFilterMethod(bytes, lineByteLength, bytesPerPixel, filter_method) {
    var lines = bytes.length / lineByteLength;
    var result = new Uint8Array(bytes.length + lines);
    var filter_methods = getFilterMethods();
    var prevLine;
    for (var i = 0; i < lines; i += 1) {
      var offset = i * lineByteLength;
      var line = bytes.subarray(offset, offset + lineByteLength);
      if (filter_method) {
        result.set(filter_method(line, bytesPerPixel, prevLine), offset + i);
      } else {
        var len = filter_methods.length;
        var results = [];
        for (var j = 0; j < len; j += 1) {
          results[j] = filter_methods[j](line, bytesPerPixel, prevLine);
        }
        var ind = getIndexOfSmallestSum(results.concat());
        result.set(results[ind], offset + i);
      }
      prevLine = line;
    }
    return result;
  }
