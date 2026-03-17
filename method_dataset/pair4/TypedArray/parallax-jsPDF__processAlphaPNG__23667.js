  function processAlphaPNG(decodedPng) {
    var data = decodedPng.data,
      width = decodedPng.width,
      height = decodedPng.height,
      channels = decodedPng.channels,
      depth = decodedPng.depth;
    var colorSpace = channels === 2 ? "DeviceGray" : "DeviceRGB";
    var colorsPerPixel = channels - 1;
    var totalPixels = width * height;
    var colorChannels = colorsPerPixel; // 1 for Gray, 3 for RGB
    var alphaChannels = 1;
    var totalColorSamples = totalPixels * colorChannels;
    var totalAlphaSamples = totalPixels * alphaChannels;
    var colorByteLen = Math.ceil(totalColorSamples * depth / 8);
    var alphaByteLen = Math.ceil(totalAlphaSamples * depth / 8);
    var colorBytes = new Uint8Array(colorByteLen);
    var alphaBytes = new Uint8Array(alphaByteLen);
    var dataView = new DataView(data.buffer);
    var colorView = new DataView(colorBytes.buffer);
    var alphaView = new DataView(alphaBytes.buffer);
    var needSMask = false;
    for (var p = 0; p < totalPixels; p++) {
      var pixelStartIndex = p * channels;
      for (var s = 0; s < colorChannels; s++) {
        var _sampleIndex = pixelStartIndex + s;
        var colorValue = readSample(dataView, _sampleIndex, depth);
        writeSample(colorView, colorValue, p * colorChannels + s, depth);
      }
      var sampleIndex = pixelStartIndex + colorChannels;
      var alphaValue = readSample(dataView, sampleIndex, depth);
      if (alphaValue < (1 << depth) - 1) {
        needSMask = true;
      }
      writeSample(alphaView, alphaValue, p * alphaChannels, depth);
    }
    return {
      colorSpace: colorSpace,
      colorsPerPixel: colorsPerPixel,
      sMaskBitsPerComponent: needSMask ? depth : undefined,
      colorBytes: colorBytes,
      alphaBytes: alphaBytes,
      needSMask: needSMask
    };
  }
