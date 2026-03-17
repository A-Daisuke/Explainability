function decompress_iwa_file(buf) {
  if (Array.isArray(buf))
    buf = new Uint8Array(buf);
  var out = [];
  var l = 0;
  while (l < buf.length) {
    var t = buf[l++];
    var len = buf[l] | buf[l + 1] << 8 | buf[l + 2] << 16;
    l += 3;
    out.push.apply(out, parse_snappy_chunk(t, buf[subarray](l, l + len)));
    l += len;
  }
  if (l !== buf.length)
    throw new Error("data is not a valid framed stream!");
  return out.length == 1 ? out[0] : u8concat(out);
}
