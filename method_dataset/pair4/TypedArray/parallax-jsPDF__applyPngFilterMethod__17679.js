function applyPngFilterMethod(
  bytes,
  lineByteLength,
  bytesPerPixel,
  filter_method
) {
  const lines = bytes.length / lineByteLength;
  const result = new Uint8Array(bytes.length + lines);
  const filter_methods = getFilterMethods();
  let prevLine;

  for (let i = 0; i < lines; i += 1) {
    const offset = i * lineByteLength;
    const line = bytes.subarray(offset, offset + lineByteLength);

    if (filter_method) {
      result.set(filter_method(line, bytesPerPixel, prevLine), offset + i);
    } else {
      const len = filter_methods.length;
      const results = [];

      for (let j = 0; j < len; j += 1) {
        results[j] = filter_methods[j](line, bytesPerPixel, prevLine);
      }

      const ind = getIndexOfSmallestSum(results.concat());

      result.set(results[ind], offset + i);
    }

    prevLine = line;
  }

  return result;
}
