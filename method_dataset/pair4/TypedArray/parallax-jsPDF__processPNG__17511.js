function __method_wrapper__() {
jsPDF.API.processPNG = function(imageData, index, alias, compression) {
  if (this.__addimage__.isArrayBuffer(imageData)) {
    imageData = new Uint8Array(imageData);
  }
  if (!this.__addimage__.isArrayBufferView(imageData)) {
    return;
  }

  const decodedPng = fastPng.decode(imageData, { checkCrc: true });
  const {
    width,
    height,
    channels,
    palette: decodedPalette,
    depth: bitsPerComponent
  } = decodedPng;

  let result;
  if (decodedPalette && channels === 1) {
    result = processIndexedPNG(decodedPng);
  } else if (channels === 2 || channels === 4) {
    result = processAlphaPNG(decodedPng);
  } else {
    result = processOpaquePNG(decodedPng);
  }

  const {
    colorSpace,
    colorsPerPixel,
    sMaskBitsPerComponent,
    colorBytes,
    alphaBytes,
    needSMask,
    palette,
    mask
  } = result;

  let predictor = null;

  let filter, decodeParameters, sMask;
  if (canCompress(compression)) {
    predictor = getPredictorFromCompression(compression);
    filter = this.decode.FLATE_DECODE;
    decodeParameters = `/Predictor ${predictor} /Colors ${colorsPerPixel} /BitsPerComponent ${bitsPerComponent} /Columns ${width}`;

    const rowByteLength = Math.ceil(
      (width * colorsPerPixel * bitsPerComponent) / 8
    );

    imageData = compressBytes(
      colorBytes,
      rowByteLength,
      colorsPerPixel,
      bitsPerComponent,
      compression
    );
    if (needSMask) {
      const sMaskRowByteLength = Math.ceil((width * sMaskBitsPerComponent) / 8);
      sMask = compressBytes(
        alphaBytes,
        sMaskRowByteLength,
        1,
        sMaskBitsPerComponent,
        compression
      );
    }
  } else {
    filter = undefined;
    decodeParameters = undefined;
    imageData = colorBytes;
    if (needSMask) sMask = alphaBytes;
  }

  if (
    this.__addimage__.isArrayBuffer(imageData) ||
    this.__addimage__.isArrayBufferView(imageData)
  ) {
    imageData = this.__addimage__.arrayBufferToBinaryString(imageData);
  }

  if (
    (sMask && this.__addimage__.isArrayBuffer(sMask)) ||
    this.__addimage__.isArrayBufferView(sMask)
  ) {
    sMask = this.__addimage__.arrayBufferToBinaryString(sMask);
  }

  return {
    alias,
    data: imageData,
    index,
    filter,
    decodeParameters,
    transparency: mask,
    palette,
    sMask,
    predictor,
    width,
    height,
    bitsPerComponent,
    sMaskBitsPerComponent,
    colorSpace
  };
};

}
