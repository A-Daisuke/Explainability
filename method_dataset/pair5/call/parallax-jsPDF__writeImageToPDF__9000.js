  var writeImageToPDF = function writeImageToPDF(x, y, width, height, image, rotation) {
    var dims = determineWidthAndHeight.call(this, width, height, image),
      coord = this.internal.getCoordinateString,
      vcoord = this.internal.getVerticalCoordinateString;
    var images = getImages.call(this);
    width = dims[0];
    height = dims[1];
    images[image.index] = image;
    if (rotation) {
      rotation *= Math.PI / 180;
      var c = Math.cos(rotation);
      var s = Math.sin(rotation);
      //like in pdf Reference do it 4 digits instead of 2
      var f4 = function f4(number) {
        return number.toFixed(4);
      };
      var rotationTransformationMatrix = [f4(c), f4(s), f4(s * -1), f4(c), 0, 0, "cm"];
    }
    this.internal.write("q"); //Save graphics state
    if (rotation) {
      this.internal.write([1, "0", "0", 1, coord(x), vcoord(y + height), "cm"].join(" ")); //Translate
      this.internal.write(rotationTransformationMatrix.join(" ")); //Rotate
      this.internal.write([coord(width), "0", "0", coord(height), "0", "0", "cm"].join(" ")); //Scale
    } else {
      this.internal.write([coord(width), "0", "0", coord(height), coord(x), vcoord(y + height), "cm"].join(" ")); //Translate and Scale
    }
    if (this.isAdvancedAPI()) {
      // draw image bottom up when in "advanced" API mode
      this.internal.write([1, 0, 0, -1, 0, 0, "cm"].join(" "));
    }
    this.internal.write("/I" + image.index + " Do"); //Paint Image
    this.internal.write("Q"); //Restore graphics state
  };
