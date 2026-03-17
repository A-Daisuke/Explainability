function __method_wrapper__() {
  API.addFont = function(
    postScriptName,
    fontName,
    fontStyle,
    fontWeight,
    encoding
  ) {
    var encodingOptions = [
      "StandardEncoding",
      "MacRomanEncoding",
      "Identity-H",
      "WinAnsiEncoding"
    ];
    if (arguments[3] && encodingOptions.indexOf(arguments[3]) !== -1) {
      //IE 11 fix
      encoding = arguments[3];
    } else if (arguments[3] && encodingOptions.indexOf(arguments[3]) == -1) {
      fontStyle = combineFontStyleAndFontWeight(fontStyle, fontWeight);
    }
    encoding = encoding || "Identity-H";
    return addFont.call(this, postScriptName, fontName, fontStyle, encoding);
  };

}
