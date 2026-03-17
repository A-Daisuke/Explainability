function processIndexedPNG(decodedPng) {
  const { width, height, data, palette: decodedPalette, depth } = decodedPng;
  let needSMask = false;
  let palette = [];
  let mask = [];
  let alphaBytes = undefined;
  let hasSemiTransparency = false;

  const maxMaskLength = 1;
  let maskLength = 0;

  for (let i = 0; i < decodedPalette.length; i++) {
    const [r, g, b, a] = decodedPalette[i];
    palette.push(r, g, b);
    if (a != null) {
      if (a === 0) {
        maskLength++;
        if (mask.length < maxMaskLength) {
          mask.push(i);
        }
      } else if (a < 255) {
        hasSemiTransparency = true;
      }
    }
  }

  if (hasSemiTransparency || maskLength > maxMaskLength) {
    needSMask = true;
    mask = undefined;

    const totalPixels = width * height;
    // per PNG spec, palettes always use 8 bits per component
    alphaBytes = new Uint8Array(totalPixels);
    const dataView = new DataView(data.buffer);
    for (let p = 0; p < totalPixels; p++) {
      const paletteIndex = readSample(dataView, p, depth);
      const [, , , alpha] = decodedPalette[paletteIndex];
      alphaBytes[p] = alpha;
    }
  } else if (maskLength === 0) {
    mask = undefined;
  }

  return {
    colorSpace: "Indexed",
    colorsPerPixel: 1,
    sMaskBitsPerComponent: needSMask ? 8 : undefined,
    colorBytes: data,
    alphaBytes,
    needSMask,
    palette,
    mask
  };
}
