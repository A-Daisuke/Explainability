function __method_wrapper__() {
            compileCharStrings: function CFFCompiler_compileCharStrings(
              charStrings
            ) {
              var charStringsIndex = new CFFIndex();

              for (var i = 0; i < charStrings.count; i++) {
                var glyph = charStrings.get(i);

                if (glyph.length === 0) {
                  charStringsIndex.add(new Uint8Array([0x8b, 0x0e]));
                  continue;
                }

                charStringsIndex.add(glyph);
              }

              return this.compileIndex(charStringsIndex);
            },

}
