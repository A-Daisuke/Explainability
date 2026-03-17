function __method_wrapper__() {
    jsPDFAPI.addImage = function () {
      var imageData, format, x, y, w, h, alias, compression, rotation;
      imageData = arguments[0];
      if (typeof arguments[1] === "number") {
        format = UNKNOWN;
        x = arguments[1];
        y = arguments[2];
        w = arguments[3];
        h = arguments[4];
        alias = arguments[5];
        compression = arguments[6];
        rotation = arguments[7];
      } else {
        format = arguments[1];
        x = arguments[2];
        y = arguments[3];
        w = arguments[4];
        h = arguments[5];
        alias = arguments[6];
        compression = arguments[7];
        rotation = arguments[8];
      }
      if (_typeof(imageData) === "object" && !isDOMElement(imageData) && "imageData" in imageData) {
        var options = imageData;
        imageData = options.imageData;
        format = options.format || format || UNKNOWN;
        x = options.x || x || 0;
        y = options.y || y || 0;
        w = options.w || options.width || w;
        h = options.h || options.height || h;
        alias = options.alias || alias;
        compression = options.compression || compression;
        rotation = options.rotation || options.angle || rotation;
      }

      //If compression is not explicitly set, determine if we should use compression
      var filter = this.internal.getFilters();
      if (compression === undefined && filter.indexOf("FlateEncode") !== -1) {
        compression = "SLOW";
      }
      if (isNaN(x) || isNaN(y)) {
        throw new Error("Invalid coordinates passed to jsPDF.addImage");
      }
      initialize.call(this);
      var image = processImageData.call(this, imageData, format, alias, compression);
      writeImageToPDF.call(this, x, y, w, h, image, rotation);
      return this;
    };

}
