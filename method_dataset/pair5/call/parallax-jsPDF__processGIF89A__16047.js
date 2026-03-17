function __method_wrapper__() {
  jsPDFAPI.processGIF89A = function (imageData, index, alias, compression) {
    var reader = new GifReader(imageData);
    var width = reader.width,
      height = reader.height;
    var qu = 100;
    var pixels = [];
    reader.decodeAndBlitFrameRGBA(0, pixels);
    var rawImageData = {
      data: pixels,
      width: width,
      height: height
    };
    var encoder = new JPEGEncoder(qu);
    var data = encoder.encode(rawImageData, qu);
    return jsPDFAPI.processJPEG.call(this, data, index, alias, compression);
  };

}
