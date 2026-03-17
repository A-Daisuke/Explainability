  function processIndexedPNG(decodedPng) {
    var width = decodedPng.width,
      height = decodedPng.height,
      data = decodedPng.data,
      decodedPalette = decodedPng.palette,
      depth = decodedPng.depth;
    var needSMask = false;
    var palette = [];
    var mask = [];
    var alphaBytes = undefined;
    var hasSemiTransparency = false;
    var maxMaskLength = 1;
    var maskLength = 0;
    for (var i = 0; i < decodedPalette.length; i++) {
      var _decodedPalette$i = _slicedToArray(decodedPalette[i], 4),
        r = _decodedPalette$i[0],
        g = _decodedPalette$i[1],
        b = _decodedPalette$i[2],
        a = _decodedPalette$i[3];
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
      var totalPixels = width * height;
      // per PNG spec, palettes always use 8 bits per component
      alphaBytes = new Uint8Array(totalPixels);
      var dataView = new DataView(data.buffer);
      for (var p = 0; p < totalPixels; p++) {
        var paletteIndex = readSample(dataView, p, depth);
        var _decodedPalette$palet = _slicedToArray(decodedPalette[paletteIndex], 4),
          alpha = _decodedPalette$palet[3];
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
      alphaBytes: alphaBytes,
      needSMask: needSMask,
      palette: palette,
      mask: mask
    };
  }
