function __method_wrapper__() {
  jsPDFAPI.processJPEG = function(
    data,
    index,
    alias,
    compression,
    dataAsBinaryString,
    colorSpace
  ) {
    var filter = this.decode.DCT_DECODE,
      bpc = 8,
      dims,
      result = null;

    if (
      typeof data === "string" ||
      this.__addimage__.isArrayBuffer(data) ||
      this.__addimage__.isArrayBufferView(data)
    ) {
      // if we already have a stored binary string rep use that
      data = dataAsBinaryString || data;
      data = this.__addimage__.isArrayBuffer(data)
        ? new Uint8Array(data)
        : data;
      data = this.__addimage__.isArrayBufferView(data)
        ? this.__addimage__.arrayBufferToBinaryString(data)
        : data;

      dims = getJpegInfo(data);
      switch (dims.numcomponents) {
        case 1:
          colorSpace = this.color_spaces.DEVICE_GRAY;
          break;
        case 4:
          colorSpace = this.color_spaces.DEVICE_CMYK;
          break;
        case 3:
          colorSpace = this.color_spaces.DEVICE_RGB;
          break;
      }

      result = {
        data: data,
        width: dims.width,
        height: dims.height,
        colorSpace: colorSpace,
        bitsPerComponent: bpc,
        filter: filter,
        index: index,
        alias: alias
      };
    }
    return result;
  };

}
