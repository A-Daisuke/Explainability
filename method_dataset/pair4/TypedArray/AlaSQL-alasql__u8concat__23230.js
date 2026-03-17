function u8concat(u8a) {
  var len = 0;
  for (var i = 0; i < u8a.length; ++i)
    len += u8a[i].length;
  var out = new Uint8Array(len);
  var off = 0;
  for (i = 0; i < u8a.length; ++i) {
    var u8 = u8a[i], L = u8.length;
    if (L < 250) {
      for (var j = 0; j < L; ++j)
        out[off++] = u8[j];
    } else {
      out.set(u8, off);
      off += L;
    }
  }
  return out;
}
