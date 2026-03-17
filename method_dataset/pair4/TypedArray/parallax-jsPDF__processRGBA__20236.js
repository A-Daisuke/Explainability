function __method_wrapper__() {
  jsPDFAPI.processRGBA = function (imageData, index, alias) {

    var imagePixels = imageData.data;
    var length = imagePixels.length;
    // jsPDF takes alpha data separately so extract that.
    var rgbOut = new Uint8Array(length / 4 * 3);
    var alphaOut = new Uint8Array(length / 4);
    var outIndex = 0;
    var alphaIndex = 0;
    for (var i = 0; i < length; i += 4) {
      var r = imagePixels[i];
      var g = imagePixels[i + 1];
      var b = imagePixels[i + 2];
      var alpha = imagePixels[i + 3];
      rgbOut[outIndex++] = r;
      rgbOut[outIndex++] = g;
      rgbOut[outIndex++] = b;
      alphaOut[alphaIndex++] = alpha;
    }
    var rgbData = this.__addimage__.arrayBufferToBinaryString(rgbOut);
    var alphaData = this.__addimage__.arrayBufferToBinaryString(alphaOut);
    return {
      alpha: alphaData,
      data: rgbData,
      index: index,
      alias: alias,
      colorSpace: "DeviceRGB",
      bitsPerComponent: 8,
      width: imageData.width,
      height: imageData.height
    };
  };

}
