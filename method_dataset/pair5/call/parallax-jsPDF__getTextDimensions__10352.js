function __method_wrapper__() {
  jsPDFAPI.getTextDimensions = function (text, options) {
    _initialize.call(this);
    options = options || {};
    var fontSize = options.fontSize || this.getFontSize();
    var font = options.font || this.getFont();
    var scaleFactor = options.scaleFactor || this.internal.scaleFactor;
    var width = 0;
    var amountOfLines = 0;
    var height = 0;
    var tempWidth = 0;
    var scope = this;
    if (!Array.isArray(text) && typeof text !== "string") {
      if (typeof text === "number") {
        text = String(text);
      } else {
        throw new Error("getTextDimensions expects text-parameter to be of type String or type Number or an Array of Strings.");
      }
    }
    var maxWidth = options.maxWidth;
    if (maxWidth > 0) {
      if (typeof text === "string") {
        text = this.splitTextToSize(text, maxWidth);
      } else if (Object.prototype.toString.call(text) === "[object Array]") {
        text = text.reduce(function (acc, textLine) {
          return acc.concat(scope.splitTextToSize(textLine, maxWidth));
        }, []);
      }
    } else {
      // Without the else clause, it will not work if you do not pass along maxWidth
      text = Array.isArray(text) ? text : [text];
    }
    for (var i = 0; i < text.length; i++) {
      tempWidth = this.getStringUnitWidth(text[i], {
        font: font
      }) * fontSize;
      if (width < tempWidth) {
        width = tempWidth;
      }
    }
    if (width !== 0) {
      amountOfLines = text.length;
    }
    width = width / scaleFactor;
    height = Math.max((amountOfLines * fontSize * this.getLineHeightFactor() - fontSize * (this.getLineHeightFactor() - 1)) / scaleFactor, 0);
    return {
      w: width,
      h: height
    };
  };

}
