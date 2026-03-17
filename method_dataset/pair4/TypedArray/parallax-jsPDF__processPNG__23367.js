function __method_wrapper__() {
  jsPDF.API.processPNG = function (imageData, index, alias, compression) {
    if (this.__addimage__.isArrayBuffer(imageData)) {
      imageData = new Uint8Array(imageData);
    }
    if (!this.__addimage__.isArrayBufferView(imageData)) {
      return;
    }
    var decodedPng = decodePng(imageData, {
      checkCrc: true
    });
    var width = decodedPng.width,
      height = decodedPng.height,
      channels = decodedPng.channels,
      decodedPalette = decodedPng.palette,
      bitsPerComponent = decodedPng.depth;
    var result;
    if (decodedPalette && channels === 1) {
      result = processIndexedPNG(decodedPng);
    } else if (channels === 2 || channels === 4) {
      result = processAlphaPNG(decodedPng);
    } else {
      result = processOpaquePNG(decodedPng);
    }
    var _result = result,
      colorSpace = _result.colorSpace,
      colorsPerPixel = _result.colorsPerPixel,
      sMaskBitsPerComponent = _result.sMaskBitsPerComponent,
      colorBytes = _result.colorBytes,
      alphaBytes = _result.alphaBytes,
      needSMask = _result.needSMask,
      palette = _result.palette,
      mask = _result.mask;
    var predictor = null;
    var filter, decodeParameters, sMask;
    if (canCompress(compression)) {
      predictor = getPredictorFromCompression(compression);
      filter = this.decode.FLATE_DECODE;
      decodeParameters = "/Predictor ".concat(predictor, " /Colors ").concat(colorsPerPixel, " /BitsPerComponent ").concat(bitsPerComponent, " /Columns ").concat(width);
      var rowByteLength = Math.ceil(width * colorsPerPixel * bitsPerComponent / 8);
      imageData = compressBytes(colorBytes, rowByteLength, colorsPerPixel, bitsPerComponent, compression);
      if (needSMask) {
        var sMaskRowByteLength = Math.ceil(width * sMaskBitsPerComponent / 8);
        sMask = compressBytes(alphaBytes, sMaskRowByteLength, 1, sMaskBitsPerComponent, compression);
      }
    } else {
      filter = undefined;
      decodeParameters = undefined;
      imageData = colorBytes;
      if (needSMask) sMask = alphaBytes;
    }
    if (this.__addimage__.isArrayBuffer(imageData) || this.__addimage__.isArrayBufferView(imageData)) {
      imageData = this.__addimage__.arrayBufferToBinaryString(imageData);
    }
    if (sMask && this.__addimage__.isArrayBuffer(sMask) || this.__addimage__.isArrayBufferView(sMask)) {
      sMask = this.__addimage__.arrayBufferToBinaryString(sMask);
    }
    return {
      alias: alias,
      data: imageData,
      index: index,
      filter: filter,
      decodeParameters: decodeParameters,
      transparency: mask,
      palette: palette,
      sMask: sMask,
      predictor: predictor,
      width: width,
      height: height,
      bitsPerComponent: bitsPerComponent,
      sMaskBitsPerComponent: sMaskBitsPerComponent,
      colorSpace: colorSpace
    };
  };

}
