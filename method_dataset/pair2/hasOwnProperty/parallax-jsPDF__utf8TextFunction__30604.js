    var utf8TextFunction = function utf8TextFunction(args) {
      var text = args.text || "";
      var x = args.x;
      var y = args.y;
      var options = args.options || {};
      var mutex = args.mutex || {};
      var pdfEscape = mutex.pdfEscape;
      var activeFontKey = mutex.activeFontKey;
      var fonts = mutex.fonts;
      var key = activeFontKey;
      var str = "",
        s = 0,
        cmapConfirm;
      var strText = "";
      var encoding = fonts[key].encoding;
      if (fonts[key].encoding !== "Identity-H") {
        return {
          text: text,
          x: x,
          y: y,
          options: options,
          mutex: mutex
        };
      }
      strText = text;
      key = activeFontKey;
      if (Array.isArray(text)) {
        strText = text[0];
      }
      for (s = 0; s < strText.length; s += 1) {
        if (fonts[key].metadata.hasOwnProperty("cmap")) {
          cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s].charCodeAt(0)];
          /*
               if (Object.prototype.toString.call(text) === '[object Array]') {
                  var i = 0;
                 // for (i = 0; i < text.length; i += 1) {
                      if (Object.prototype.toString.call(text[s]) === '[object Array]') {
                          cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s][0].charCodeAt(0)]; //Make sure the cmap has the corresponding glyph id
                      } else {
                       }
                  //}
               } else {
                  cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s].charCodeAt(0)]; //Make sure the cmap has the corresponding glyph id
              }*/
        }
        if (!cmapConfirm) {
          if (strText[s].charCodeAt(0) < 256 && fonts[key].metadata.hasOwnProperty("Unicode")) {
            str += strText[s];
          } else {
            str += "";
          }
        } else {
          str += strText[s];
        }
      }
      var result = "";
      if (parseInt(key.slice(1)) < 14 || encoding === "WinAnsiEncoding") {
        //For the default 13 font
        result = pdfEscape(str, key).split("").map(function (cv) {
          return cv.charCodeAt(0).toString(16);
        }).join("");
      } else if (encoding === "Identity-H") {
        result = pdfEscape16(str, fonts[key]);
      }
      mutex.isHex = true;
      return {
        text: result,
        x: x,
        y: y,
        options: options,
        mutex: mutex
      };
    };
