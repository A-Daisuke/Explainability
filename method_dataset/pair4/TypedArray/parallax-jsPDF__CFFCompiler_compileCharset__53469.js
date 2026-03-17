const __obj__ = {
            compileCharset: function CFFCompiler_compileCharset(
              charset,
              numGlyphs,
              strings,
              isCIDFont
            ) {
              var out;
              var numGlyphsLessNotDef = numGlyphs - 1;

              if (isCIDFont) {
                out = new Uint8Array([
                  2,
                  0,
                  0,
                  (numGlyphsLessNotDef >> 8) & 0xff,
                  numGlyphsLessNotDef & 0xff
                ]);
              } else {
                var length = 1 + numGlyphsLessNotDef * 2;
                out = new Uint8Array(length);
                out[0] = 0;
                var charsetIndex = 0;
                var numCharsets = charset.charset.length;
                var warned = false;

                for (var i = 1; i < out.length; i += 2) {
                  var sid = 0;

                  if (charsetIndex < numCharsets) {
                    var name = charset.charset[charsetIndex++];
                    sid = strings.getSID(name);

                    if (sid === -1) {
                      sid = 0;

                      if (!warned) {
                        warned = true;
                        (0, _util.warn)(
                          "Couldn't find ".concat(name, " in CFF strings")
                        );
                      }
                    }
                  }

                  out[i] = (sid >> 8) & 0xff;
                  out[i + 1] = sid & 0xff;
                }
              }

              return this.compileTypedArray(out);
            },

};
