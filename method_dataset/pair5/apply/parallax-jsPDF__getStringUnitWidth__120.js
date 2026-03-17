  var getStringUnitWidth = (API.getStringUnitWidth = function(text, options) {
    options = options || {};

    var fontSize = options.fontSize || this.internal.getFontSize();
    var font = options.font || this.internal.getFont();
    var charSpace = options.charSpace || this.internal.getCharSpace();
    var result = 0;

    if (API.processArabic) {
      text = API.processArabic(text);
    }

    if (typeof font.metadata.widthOfString === "function") {
      result =
        font.metadata.widthOfString(text, fontSize, charSpace) / fontSize;
    } else {
      result = getCharWidthsArray
        .apply(this, arguments)
        .reduce(function(pv, cv) {
          return pv + cv;
        }, 0);
    }
    return result;
  });
