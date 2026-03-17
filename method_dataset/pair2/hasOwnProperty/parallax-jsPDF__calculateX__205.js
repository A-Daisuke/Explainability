var calculateX = function(formObject, text) {
  var maxFontSize =
    formObject.fontSize === 0 ? formObject.maxFontSize : formObject.fontSize;
  var returnValue = {
    text: "",
    fontSize: ""
  };
  // Remove Brackets
  text = text.substr(0, 1) == "(" ? text.substr(1) : text;
  text =
    text.substr(text.length - 1) == ")"
      ? text.substr(0, text.length - 1)
      : text;
  // split into array of words
  var textSplit = text.split(" ");
  if (formObject.multiline) {
    textSplit = textSplit.map(word => word.split("\n"));
  } else {
    textSplit = textSplit.map(word => [word]);
  }

  var fontSize = maxFontSize; // The Starting fontSize (The Maximum)
  var lineSpacing = 2;
  var borderPadding = 2;

  var height = AcroFormAppearance.internal.getHeight(formObject) || 0;
  height = height < 0 ? -height : height;
  var width = AcroFormAppearance.internal.getWidth(formObject) || 0;
  width = width < 0 ? -width : width;

  var isSmallerThanWidth = function(i, lastLine, fontSize) {
    if (i + 1 < textSplit.length) {
      var tmp = lastLine + " " + textSplit[i + 1][0];
      var TextWidth = calculateFontSpace(tmp, formObject, fontSize).width;
      var FieldWidth = width - 2 * borderPadding;
      return TextWidth <= FieldWidth;
    } else {
      return false;
    }
  };

  fontSize++;
  FontSize: while (fontSize > 0) {
    text = "";
    fontSize--;
    var textHeight = calculateFontSpace("3", formObject, fontSize).height;
    var startY = formObject.multiline
      ? height - fontSize
      : (height - textHeight) / 2;
    startY += lineSpacing;
    var startX;

    var lastY = startY;
    var firstWordInLine = 0,
      lastWordInLine = 0;
    var lastLength;
    var currWord = 0;

    if (fontSize <= 0) {
      // In case, the Text doesn't fit at all
      fontSize = 12;
      text = "(...) Tj\n";
      text +=
        "% Width of Text: " +
        calculateFontSpace(text, formObject, fontSize).width +
        ", FieldWidth:" +
        width +
        "\n";
      break;
    }

    var lastLine = "";
    var lineCount = 0;
    Line: for (var i = 0; i < textSplit.length; i++) {
      if (textSplit.hasOwnProperty(i)) {
        let isWithNewLine = false;
        if (textSplit[i].length !== 1 && currWord !== textSplit[i].length - 1) {
          if (
            (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing >
            height
          ) {
            continue FontSize;
          }

          lastLine += textSplit[i][currWord];
          isWithNewLine = true;
          lastWordInLine = i;
          i--;
        } else {
          lastLine += textSplit[i][currWord] + " ";
          lastLine =
            lastLine.substr(lastLine.length - 1) == " "
              ? lastLine.substr(0, lastLine.length - 1)
              : lastLine;
          var key = parseInt(i);
          var nextLineIsSmaller = isSmallerThanWidth(key, lastLine, fontSize);
          var isLastWord = i >= textSplit.length - 1;

          if (nextLineIsSmaller && !isLastWord) {
            lastLine += " ";
            currWord = 0;
            continue; // Line
          } else if (!nextLineIsSmaller && !isLastWord) {
            if (!formObject.multiline) {
              continue FontSize;
            } else {
              if (
                (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing >
                height
              ) {
                // If the Text is higher than the
                // FieldObject
                continue FontSize;
              }
              lastWordInLine = key;
              // go on
            }
          } else if (isLastWord) {
            lastWordInLine = key;
          } else {
            if (
              formObject.multiline &&
              (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing >
                height
            ) {
              // If the Text is higher than the FieldObject
              continue FontSize;
            }
          }
        }
        // Remove last blank

        var line = "";

        for (var x = firstWordInLine; x <= lastWordInLine; x++) {
          var currLine = textSplit[x];
          if (formObject.multiline) {
            if (x === lastWordInLine) {
              line += currLine[currWord] + " ";
              currWord = (currWord + 1) % currLine.length;
              continue;
            }
            if (x === firstWordInLine) {
              line += currLine[currLine.length - 1] + " ";
              continue;
            }
          }
          line += currLine[0] + " ";
        }

        // Remove last blank
        line =
          line.substr(line.length - 1) == " "
            ? line.substr(0, line.length - 1)
            : line;
        // lastLength -= blankSpace.width;
        lastLength = calculateFontSpace(line, formObject, fontSize).width;

        // Calculate startX
        switch (formObject.textAlign) {
          case "right":
            startX = width - lastLength - borderPadding;
            break;
          case "center":
            startX = (width - lastLength) / 2;
            break;
          case "left":
          default:
            startX = borderPadding;
            break;
        }
        text += f2(startX) + " " + f2(lastY) + " Td\n";
        text += "(" + pdfEscape(line) + ") Tj\n";
        // reset X in PDF
        text += -f2(startX) + " 0 Td\n";

        // After a Line, adjust y position
        lastY = -(fontSize + lineSpacing);

        // Reset for next iteration step
        lastLength = 0;
        firstWordInLine = isWithNewLine ? lastWordInLine : lastWordInLine + 1;
        lineCount++;

        lastLine = "";
        continue Line;
      }
    }
    break;
  }

  returnValue.text = text;
  returnValue.fontSize = fontSize;

  return returnValue;
};
