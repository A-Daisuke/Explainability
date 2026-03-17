function __method_wrapper__() {
    API.__private__.text = API.text = function (text, x, y, options, transform) {
      /*
       * Inserts something like this into PDF
       *   BT
       *    /F1 16 Tf  % Font name + size
       *    16 TL % How many units down for next line in multiline text
       *    0 g % color
       *    28.35 813.54 Td % position
       *    (line one) Tj
       *    T* (line two) Tj
       *    T* (line three) Tj
       *   ET
       */
      options = options || {};
      var scope = options.scope || this;
      var payload, da, angle, align, charSpace, maxWidth, flags, horizontalScale;

      // Pre-August-2012 the order of arguments was function(x, y, text, flags)
      // in effort to make all calls have similar signature like
      //   function(data, coordinates... , miscellaneous)
      // this method had its args flipped.
      // code below allows backward compatibility with old arg order.
      if (typeof text === "number" && typeof x === "number" && (typeof y === "string" || Array.isArray(y))) {
        var tmp = y;
        y = x;
        x = text;
        text = tmp;
      }
      var transformationMatrix;
      if (arguments[3] instanceof Matrix === false) {
        flags = arguments[3];
        angle = arguments[4];
        align = arguments[5];
        if (_typeof(flags) !== "object" || flags === null) {
          if (typeof angle === "string") {
            align = angle;
            angle = null;
          }
          if (typeof flags === "string") {
            align = flags;
            flags = null;
          }
          if (typeof flags === "number") {
            angle = flags;
            flags = null;
          }
          options = {
            flags: flags,
            angle: angle,
            align: align
          };
        }
      } else {
        advancedApiModeTrap("The transform parameter of text() with a Matrix value");
        transformationMatrix = transform;
      }
      if (isNaN(x) || isNaN(y) || typeof text === "undefined" || text === null) {
        throw new Error("Invalid arguments passed to jsPDF.text");
      }
      if (text.length === 0) {
        return scope;
      }
      var xtra = "";
      var isHex = false;
      var lineHeight = typeof options.lineHeightFactor === "number" ? options.lineHeightFactor : lineHeightFactor;
      var scaleFactor = scope.internal.scaleFactor;
      function ESC(s) {
        s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
        return pdfEscape(s, flags);
      }
      function transformTextToSpecialArray(text) {
        //we don't want to destroy original text array, so cloning it
        var sa = text.concat();
        var da = [];
        var len = sa.length;
        var curDa;
        //we do array.join('text that must not be PDFescaped")
        //thus, pdfEscape each component separately
        while (len--) {
          curDa = sa.shift();
          if (typeof curDa === "string") {
            da.push(curDa);
          } else {
            if (Array.isArray(text) && (curDa.length === 1 || curDa[1] === undefined && curDa[2] === undefined)) {
              da.push(curDa[0]);
            } else {
              da.push([curDa[0], curDa[1], curDa[2]]);
            }
          }
        }
        return da;
      }
      function processTextByFunction(text, processingFunction) {
        var result;
        if (typeof text === "string") {
          result = processingFunction(text)[0];
        } else if (Array.isArray(text)) {
          //we don't want to destroy original text array, so cloning it
          var sa = text.concat();
          var da = [];
          var len = sa.length;
          var curDa;
          var tmpResult;
          //we do array.join('text that must not be PDFescaped")
          //thus, pdfEscape each component separately
          while (len--) {
            curDa = sa.shift();
            if (typeof curDa === "string") {
              da.push(processingFunction(curDa)[0]);
            } else if (Array.isArray(curDa) && typeof curDa[0] === "string") {
              tmpResult = processingFunction(curDa[0], curDa[1], curDa[2]);
              da.push([tmpResult[0], tmpResult[1], tmpResult[2]]);
            }
          }
          result = da;
        }
        return result;
      }

      //Check if text is of type String
      var textIsOfTypeString = false;
      var tmpTextIsOfTypeString = true;
      if (typeof text === "string") {
        textIsOfTypeString = true;
      } else if (Array.isArray(text)) {
        //we don't want to destroy original text array, so cloning it
        var sa = text.concat();
        da = [];
        var len = sa.length;
        var curDa;
        //we do array.join('text that must not be PDFescaped")
        //thus, pdfEscape each component separately
        while (len--) {
          curDa = sa.shift();
          if (typeof curDa !== "string" || Array.isArray(curDa) && typeof curDa[0] !== "string") {
            tmpTextIsOfTypeString = false;
          }
        }
        textIsOfTypeString = tmpTextIsOfTypeString;
      }
      if (textIsOfTypeString === false) {
        throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
      }

      //If there are any newlines in text, we assume
      //the user wanted to print multiple lines, so break the
      //text up into an array. If the text is already an array,
      //we assume the user knows what they are doing.
      //Convert text into an array anyway to simplify
      //later code.

      if (typeof text === "string") {
        if (text.match(/[\r?\n]/)) {
          text = text.split(/\r\n|\r|\n/g);
        } else {
          text = [text];
        }
      }

      //baseline
      var height = activeFontSize / scope.internal.scaleFactor;
      var descent = height * (lineHeight - 1);
      switch (options.baseline) {
        case "bottom":
          y -= descent;
          break;
        case "top":
          y += height - descent;
          break;
        case "hanging":
          y += height - 2 * descent;
          break;
        case "middle":
          y += height / 2 - descent;
          break;
      }

      //multiline
      maxWidth = options.maxWidth || 0;
      if (maxWidth > 0) {
        if (typeof text === "string") {
          text = scope.splitTextToSize(text, maxWidth);
        } else if (Object.prototype.toString.call(text) === "[object Array]") {
          text = text.reduce(function (acc, textLine) {
            return acc.concat(scope.splitTextToSize(textLine, maxWidth));
          }, []);
        }
      }

      //creating Payload-Object to make text byRef
      payload = {
        text: text,
        x: x,
        y: y,
        options: options,
        mutex: {
          pdfEscape: pdfEscape,
          activeFontKey: activeFontKey,
          fonts: fonts,
          activeFontSize: activeFontSize
        }
      };
      events.publish("preProcessText", payload);
      text = payload.text;
      options = payload.options;

      //angle
      angle = options.angle;
      if (transformationMatrix instanceof Matrix === false && angle && typeof angle === "number") {
        angle *= Math.PI / 180;
        if (options.rotationDirection === 0) {
          angle = -angle;
        }
        if (apiMode === ApiMode.ADVANCED) {
          angle = -angle;
        }
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        transformationMatrix = new Matrix(c, s, -s, c, 0, 0);
      } else if (angle && angle instanceof Matrix) {
        transformationMatrix = angle;
      }
      if (apiMode === ApiMode.ADVANCED && !transformationMatrix) {
        transformationMatrix = identityMatrix;
      }

      //charSpace

      charSpace = options.charSpace || activeCharSpace;
      if (typeof charSpace !== "undefined") {
        xtra += hpf(scale(charSpace)) + " Tc\n";
        this.setCharSpace(this.getCharSpace() || 0);
      }
      horizontalScale = options.horizontalScale;
      if (typeof horizontalScale !== "undefined") {
        xtra += hpf(horizontalScale * 100) + " Tz\n";
      }

      //lang

      options.lang;

      //renderingMode
      var renderingMode = -1;
      var parmRenderingMode = typeof options.renderingMode !== "undefined" ? options.renderingMode : options.stroke;
      var pageContext = scope.internal.getCurrentPageInfo().pageContext;
      switch (parmRenderingMode) {
        case 0:
        case false:
        case "fill":
          renderingMode = 0;
          break;
        case 1:
        case true:
        case "stroke":
          renderingMode = 1;
          break;
        case 2:
        case "fillThenStroke":
          renderingMode = 2;
          break;
        case 3:
        case "invisible":
          renderingMode = 3;
          break;
        case 4:
        case "fillAndAddForClipping":
          renderingMode = 4;
          break;
        case 5:
        case "strokeAndAddPathForClipping":
          renderingMode = 5;
          break;
        case 6:
        case "fillThenStrokeAndAddToPathForClipping":
          renderingMode = 6;
          break;
        case 7:
        case "addToPathForClipping":
          renderingMode = 7;
          break;
      }
      var usedRenderingMode = typeof pageContext.usedRenderingMode !== "undefined" ? pageContext.usedRenderingMode : -1;

      //if the coder wrote it explicitly to use a specific
      //renderingMode, then use it
      if (renderingMode !== -1) {
        xtra += renderingMode + " Tr\n";
        //otherwise check if we used the rendering Mode already
        //if so then set the rendering Mode...
      } else if (usedRenderingMode !== -1) {
        xtra += "0 Tr\n";
      }
      if (renderingMode !== -1) {
        pageContext.usedRenderingMode = renderingMode;
      }

      //align
      align = options.align || "left";
      var leading = activeFontSize * lineHeight;
      var pageWidth = scope.internal.pageSize.getWidth();
      var activeFont = fonts[activeFontKey];
      charSpace = options.charSpace || activeCharSpace;
      maxWidth = options.maxWidth || 0;
      var lineWidths;
      flags = Object.assign({
        autoencode: true,
        noBOM: true
      }, options.flags);
      var wordSpacingPerLine = [];
      var findWidth = function findWidth(v) {
        return scope.getStringUnitWidth(v, {
          font: activeFont,
          charSpace: charSpace,
          fontSize: activeFontSize,
          doKerning: false
        }) * activeFontSize / scaleFactor;
      };
      if (Object.prototype.toString.call(text) === "[object Array]") {
        da = transformTextToSpecialArray(text);
        var newY;
        if (align !== "left") {
          lineWidths = da.map(findWidth);
        }
        //The first line uses the "main" Td setting,
        //and the subsequent lines are offset by the
        //previous line's x coordinate.
        var prevWidth = 0;
        var newX;
        if (align === "right") {
          //The passed in x coordinate defines the
          //rightmost point of the text.
          x -= lineWidths[0];
          text = [];
          len = da.length;
          for (var i = 0; i < len; i++) {
            if (i === 0) {
              newX = getHorizontalCoordinate(x);
              newY = getVerticalCoordinate(y);
            } else {
              newX = scale(prevWidth - lineWidths[i]);
              newY = -leading;
            }
            text.push([da[i], newX, newY]);
            prevWidth = lineWidths[i];
          }
        } else if (align === "center") {
          //The passed in x coordinate defines
          //the center point.
          x -= lineWidths[0] / 2;
          text = [];
          len = da.length;
          for (var j = 0; j < len; j++) {
            if (j === 0) {
              newX = getHorizontalCoordinate(x);
              newY = getVerticalCoordinate(y);
            } else {
              newX = scale((prevWidth - lineWidths[j]) / 2);
              newY = -leading;
            }
            text.push([da[j], newX, newY]);
            prevWidth = lineWidths[j];
          }
        } else if (align === "left") {
          text = [];
          len = da.length;
          for (var h = 0; h < len; h++) {
            text.push(da[h]);
          }
        } else if (align === "justify" && activeFont.encoding === "Identity-H") {
          // when using unicode fonts, wordSpacePerLine does not apply
          text = [];
          len = da.length;
          maxWidth = maxWidth !== 0 ? maxWidth : pageWidth;
          var backToStartX = 0;
          for (var l = 0; l < len; l++) {
            newY = l === 0 ? getVerticalCoordinate(y) : -leading;
            newX = l === 0 ? getHorizontalCoordinate(x) : backToStartX;
            if (l < len - 1) {
              var spacing = scale((maxWidth - lineWidths[l]) / (da[l].split(" ").length - 1));
              var words = da[l].split(" ");
              text.push([words[0] + " ", newX, newY]);
              backToStartX = 0; // distance to reset back to the left
              for (var _i = 1; _i < words.length; _i++) {
                var shiftAmount = (findWidth(words[_i - 1] + " " + words[_i]) - findWidth(words[_i])) * scaleFactor + spacing;
                if (_i == words.length - 1) text.push([words[_i], shiftAmount, 0]);else text.push([words[_i] + " ", shiftAmount, 0]);
                backToStartX -= shiftAmount;
              }
            } else {
              text.push([da[l], newX, newY]);
            }
          }
          text.push(["", backToStartX, 0]);
        } else if (align === "justify") {
          text = [];
          len = da.length;
          maxWidth = maxWidth !== 0 ? maxWidth : pageWidth;
          for (var l = 0; l < len; l++) {
            newY = l === 0 ? getVerticalCoordinate(y) : -leading;
            newX = l === 0 ? getHorizontalCoordinate(x) : 0;
            var numSpaces = da[l].split(" ").length - 1;
            var _spacing = numSpaces > 0 ? (maxWidth - lineWidths[l]) / numSpaces : 0;
            if (l < len - 1) {
              wordSpacingPerLine.push(hpf(scale(_spacing)));
            } else {
              wordSpacingPerLine.push(0);
            }
            text.push([da[l], newX, newY]);
          }
        } else {
          throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');
        }
      }

      //R2L
      var doReversing = typeof options.R2L === "boolean" ? options.R2L : R2L;
      if (doReversing === true) {
        text = processTextByFunction(text, function (text, posX, posY) {
          return [text.split("").reverse().join(""), posX, posY];
        });
      }

      //creating Payload-Object to make text byRef
      payload = {
        text: text,
        x: x,
        y: y,
        options: options,
        mutex: {
          pdfEscape: pdfEscape,
          activeFontKey: activeFontKey,
          fonts: fonts,
          activeFontSize: activeFontSize
        }
      };
      events.publish("postProcessText", payload);
      text = payload.text;
      isHex = payload.mutex.isHex || false;

      //Escaping
      var activeFontEncoding = fonts[activeFontKey].encoding;
      if (activeFontEncoding === "WinAnsiEncoding" || activeFontEncoding === "StandardEncoding") {
        text = processTextByFunction(text, function (text, posX, posY) {
          return [ESC(text), posX, posY];
        });
      }
      da = transformTextToSpecialArray(text);
      text = [];
      var STRING = 0;
      var ARRAY = 1;
      var variant = Array.isArray(da[0]) ? ARRAY : STRING;
      var posX;
      var posY;
      var content;
      var wordSpacing = "";
      var generatePosition = function generatePosition(parmPosX, parmPosY, parmTransformationMatrix) {
        var position = "";
        if (parmTransformationMatrix instanceof Matrix) {
          // It is kind of more intuitive to apply a plain rotation around the text anchor set by x and y
          // but when the user supplies an arbitrary transformation matrix, the x and y offsets should be applied
          // in the coordinate system established by this matrix
          if (typeof options.angle === "number") {
            parmTransformationMatrix = matrixMult(parmTransformationMatrix, new Matrix(1, 0, 0, 1, parmPosX, parmPosY));
          } else {
            parmTransformationMatrix = matrixMult(new Matrix(1, 0, 0, 1, parmPosX, parmPosY), parmTransformationMatrix);
          }
          if (apiMode === ApiMode.ADVANCED) {
            parmTransformationMatrix = matrixMult(new Matrix(1, 0, 0, -1, 0, 0), parmTransformationMatrix);
          }
          position = parmTransformationMatrix.join(" ") + " Tm\n";
        } else {
          position = hpf(parmPosX) + " " + hpf(parmPosY) + " Td\n";
        }
        return position;
      };
      for (var lineIndex = 0; lineIndex < da.length; lineIndex++) {
        wordSpacing = "";
        switch (variant) {
          case ARRAY:
            content = (isHex ? "<" : "(") + da[lineIndex][0] + (isHex ? ">" : ")");
            posX = parseFloat(da[lineIndex][1]);
            posY = parseFloat(da[lineIndex][2]);
            break;
          case STRING:
            content = (isHex ? "<" : "(") + da[lineIndex] + (isHex ? ">" : ")");
            posX = getHorizontalCoordinate(x);
            posY = getVerticalCoordinate(y);
            break;
        }
        if (typeof wordSpacingPerLine !== "undefined" && typeof wordSpacingPerLine[lineIndex] !== "undefined") {
          wordSpacing = wordSpacingPerLine[lineIndex] + " Tw\n";
        }
        if (lineIndex === 0) {
          text.push(wordSpacing + generatePosition(posX, posY, transformationMatrix) + content);
        } else if (variant === STRING) {
          text.push(wordSpacing + content);
        } else if (variant === ARRAY) {
          text.push(wordSpacing + generatePosition(posX, posY, transformationMatrix) + content);
        }
      }
      text = variant === STRING ? text.join(" Tj\nT* ") : text.join(" Tj\n");
      text += " Tj\n";
      var result = "BT\n/";
      result += activeFontKey + " " + activeFontSize + " Tf\n"; // font face, style, size
      result += hpf(activeFontSize * lineHeight) + " TL\n"; // line spacing
      result += textColor + "\n";
      result += xtra;
      result += text;
      result += "ET";
      out(result);
      usedFonts[activeFontKey] = true;
      return scope;
    };

}
