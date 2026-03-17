function processAlphaPNG(decodedPng) {
  const { data, width, height, channels, depth } = decodedPng;

  const colorSpace = channels === 2 ? "DeviceGray" : "DeviceRGB";
  const colorsPerPixel = channels - 1;

  const totalPixels = width * height;
  const colorChannels = colorsPerPixel; // 1 for Gray, 3 for RGB
  const alphaChannels = 1;
  const totalColorSamples = totalPixels * colorChannels;
  const totalAlphaSamples = totalPixels * alphaChannels;

  const colorByteLen = Math.ceil((totalColorSamples * depth) / 8);
  const alphaByteLen = Math.ceil((totalAlphaSamples * depth) / 8);
  const colorBytes = new Uint8Array(colorByteLen);
  const alphaBytes = new Uint8Array(alphaByteLen);

  const dataView = new DataView(data.buffer);
  const colorView = new DataView(colorBytes.buffer);
  const alphaView = new DataView(alphaBytes.buffer);

  let needSMask = false;
  for (let p = 0; p < totalPixels; p++) {
    const pixelStartIndex = p * channels;
    for (let s = 0; s < colorChannels; s++) {
      const sampleIndex = pixelStartIndex + s;
      const colorValue = readSample(dataView, sampleIndex, depth);
      writeSample(colorView, colorValue, p * colorChannels + s, depth);
    }
    const sampleIndex = pixelStartIndex + colorChannels;
    const alphaValue = readSample(dataView, sampleIndex, depth);
    if (alphaValue < (1 << depth) - 1) {
      needSMask = true;
    }
    writeSample(alphaView, alphaValue, p * alphaChannels, depth);
  }

  return {
    colorSpace,
    colorsPerPixel,
    sMaskBitsPerComponent: needSMask ? depth : undefined,
    colorBytes,
    alphaBytes,
    needSMask
  };
}
