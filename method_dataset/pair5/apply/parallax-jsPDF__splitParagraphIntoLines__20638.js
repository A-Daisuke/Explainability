  var splitParagraphIntoLines = function splitParagraphIntoLines(text, maxlen, options) {
    // at this time works only on Western scripts, ones with space char
    // separating the words. Feel free to expand.

    if (!options) {
      options = {};
    }
    var line = [],
      lines = [line],
      line_length = options.textIndent || 0,
      separator_length = 0,
      current_word_length = 0,
      word,
      widths_array,
      words = text.split(" "),
      spaceCharWidth = getCharWidthsArray.apply(this, [" ", options])[0],
      i,
      l,
      tmp,
      lineIndent;
    if (options.lineIndent === -1) {
      lineIndent = words[0].length + 2;
    } else {
      lineIndent = options.lineIndent || 0;
    }
    if (lineIndent) {
      var pad = Array(lineIndent).join(" "),
        wrds = [];
      words.map(function (wrd) {
        wrd = wrd.split(/\s*\n/);
        if (wrd.length > 1) {
          wrds = wrds.concat(wrd.map(function (wrd, idx) {
            return (idx && wrd.length ? "\n" : "") + wrd;
          }));
        } else {
          wrds.push(wrd[0]);
        }
      });
      words = wrds;
      lineIndent = getStringUnitWidth.apply(this, [pad, options]);
    }
    for (i = 0, l = words.length; i < l; i++) {
      var force = 0;
      word = words[i];
      if (lineIndent && word[0] == "\n") {
        word = word.substr(1);
        force = 1;
      }
      widths_array = getCharWidthsArray.apply(this, [word, options]);
      current_word_length = widths_array.reduce(function (pv, cv) {
        return pv + cv;
      }, 0);
      if (line_length + separator_length + current_word_length > maxlen || force) {
        if (current_word_length > maxlen) {
          // this happens when you have space-less long URLs for example.
          // we just chop these to size. We do NOT insert hiphens
          tmp = splitLongWord.apply(this, [word, widths_array, maxlen - (line_length + separator_length), maxlen]);
          // first line we add to existing line object
          line.push(tmp.shift()); // it's ok to have extra space indicator there
          // last line we make into new line object
          line = [tmp.pop()];
          // lines in the middle we apped to lines object as whole lines
          while (tmp.length) {
            lines.push([tmp.shift()]); // single fragment occupies whole line
          }
          current_word_length = widths_array.slice(word.length - (line[0] ? line[0].length : 0)).reduce(function (pv, cv) {
            return pv + cv;
          }, 0);
        } else {
          // just put it on a new line
          line = [word];
        }

        // now we attach new line to lines
        lines.push(line);
        line_length = current_word_length + lineIndent;
        separator_length = spaceCharWidth;
      } else {
        line.push(word);
        line_length += separator_length + current_word_length;
        separator_length = spaceCharWidth;
      }
    }
    var postProcess;
    if (lineIndent) {
      postProcess = function postProcess(ln, idx) {
        return (idx ? pad : "") + ln.join(" ");
      };
    } else {
      postProcess = function postProcess(ln) {
        return ln.join(" ");
      };
    }
    return lines.map(postProcess);
  };
