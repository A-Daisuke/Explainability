  var putFontDict = function() {
    out("/Font <<");

    for (var fontKey in fonts) {
      if (fonts.hasOwnProperty(fontKey)) {
        if (
          putOnlyUsedFonts === false ||
          (putOnlyUsedFonts === true && usedFonts.hasOwnProperty(fontKey))
        ) {
          out("/" + fontKey + " " + fonts[fontKey].objectNumber + " 0 R");
        }
      }
    }
    out(">>");
  };
