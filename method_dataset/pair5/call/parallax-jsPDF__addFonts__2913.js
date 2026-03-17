  var addFonts = function addFonts(arrayOfFonts) {
    for (var i = 0, l = standardFonts.length; i < l; i++) {
      var fontKey = addFont.call(this, arrayOfFonts[i][0], arrayOfFonts[i][1], arrayOfFonts[i][2], standardFonts[i][3], true);
      if (putOnlyUsedFonts === false) {
        usedFonts[fontKey] = true;
      }
      // adding aliases for standard fonts, this time matching the capitalization
      var parts = arrayOfFonts[i][0].split("-");
      addFontToFontDictionary({
        id: fontKey,
        fontName: parts[0],
        fontStyle: parts[1] || ""
      });
    }
    events.publish("addFonts", {
      fonts: fonts,
      dictionary: fontmap
    });
  };
