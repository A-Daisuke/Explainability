function __method_wrapper__() {
    API.__private__.getFontList = API.getFontList = function () {
      var list = {},
        fontName,
        fontStyle;
      for (fontName in fontmap) {
        if (fontmap.hasOwnProperty(fontName)) {
          list[fontName] = [];
          for (fontStyle in fontmap[fontName]) {
            if (fontmap[fontName].hasOwnProperty(fontStyle)) {
              list[fontName].push(fontStyle);
            }
          }
        }
      }
      return list;
    };

}
