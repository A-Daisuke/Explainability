  var arrayBufferToBinaryString = (jsPDFAPI.__addimage__.arrayBufferToBinaryString = function(
    buffer
  ) {
    var out = "";
    // There are calls with both ArrayBuffer and already converted Uint8Array or other BufferView.
    // Do not copy the array if input is already an array.
    var buf = isArrayBufferView(buffer) ? buffer : new Uint8Array(buffer);
    for (var i = 0; i < buf.length; i += ARRAY_APPLY_BATCH) {
      // Limit the amount of characters being parsed to prevent overflow.
      // Note that while TextDecoder would be faster, it does not have the same
      // functionality as fromCharCode with any provided encodings as of 3/2021.
      out += String.fromCharCode.apply(
        null,
        buf.subarray(i, i + ARRAY_APPLY_BATCH)
      );
    }
    return out;
  });
