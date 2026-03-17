function __method_wrapper__() {
  API.splitTextToSize = function(text, maxlen, options) {
    "use strict";

    options = options || {};

    var fsize = options.fontSize || this.internal.getFontSize(),
      newOptions = function(options) {
        var widths = {
            0: 1
          },
          kerning = {};

        if (!options.widths || !options.kerning) {
          var f = this.internal.getFont(options.fontName, options.fontStyle),
            encoding = "Unicode";
          // NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
          // Actual JavaScript-native String's 16bit char codes used.
          // no multi-byte logic here

          if (f.metadata[encoding]) {
            return {
              widths: f.metadata[encoding].widths || widths,
              kerning: f.metadata[encoding].kerning || kerning
            };
          } else {
            return {
              font: f.metadata,
              fontSize: this.internal.getFontSize(),
              charSpace: this.internal.getCharSpace()
            };
          }
        } else {
          return {
            widths: options.widths,
            kerning: options.kerning
          };
        }
      }.call(this, options);

    // first we split on end-of-line chars
    var paragraphs;
    if (Array.isArray(text)) {
      paragraphs = text;
    } else {
      paragraphs = String(text).split(/\r?\n/);
    }

    // now we convert size (max length of line) into "font size units"
    // at present time, the "font size unit" is always 'point'
    // 'proportional' means, "in proportion to font size"
    var fontUnit_maxLen = (1.0 * this.internal.scaleFactor * maxlen) / fsize;
    // at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
    // this may change in the future?
    // until then, proportional_maxlen is likely to be in 'points'

    // If first line is to be indented (shorter or longer) than maxLen
    // we indicate that by using CSS-style "text-indent" option.
    // here it's in font units too (which is likely 'points')
    // it can be negative (which makes the first line longer than maxLen)
    newOptions.textIndent = options.textIndent
      ? (options.textIndent * 1.0 * this.internal.scaleFactor) / fsize
      : 0;
    newOptions.lineIndent = options.lineIndent;

    var i,
      l,
      output = [];
    for (i = 0, l = paragraphs.length; i < l; i++) {
      output = output.concat(
        splitParagraphIntoLines.apply(this, [
          paragraphs[i],
          fontUnit_maxLen,
          newOptions
        ])
      );
    }

    return output;
  };

}
