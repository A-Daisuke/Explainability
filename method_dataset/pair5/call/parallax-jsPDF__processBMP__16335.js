function __method_wrapper__() {
  jsPDFAPI.processBMP = function (imageData, index, alias, compression) {
    var reader = new BmpDecoder(imageData, false);
    var width = reader.width,
      height = reader.height;
    var qu = 100;
    var pixels = reader.getData();
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
