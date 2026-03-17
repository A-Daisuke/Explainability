const __obj__ = {
            create: function FontRendererFactory_create(
              font,
              seacAnalysisEnabled
            ) {
              var data = new Uint8Array(font.data);
              var cmap, glyf, loca, cff, indexToLocFormat, unitsPerEm;
              var numTables = getUshort(data, 4);

              for (var i = 0, p = 12; i < numTables; i++, p += 16) {
                var tag = (0, _util.bytesToString)(data.subarray(p, p + 4));
                var offset = getLong(data, p + 8);
                var length = getLong(data, p + 12);

                switch (tag) {
                  case "cmap":
                    cmap = parseCmap(data, offset, offset + length);
                    break;

                  case "glyf":
                    glyf = data.subarray(offset, offset + length);
                    break;

                  case "loca":
                    loca = data.subarray(offset, offset + length);
                    break;

                  case "head":
                    unitsPerEm = getUshort(data, offset + 18);
                    indexToLocFormat = getUshort(data, offset + 50);
                    break;

                  case "CFF ":
                    cff = parseCff(
                      data,
                      offset,
                      offset + length,
                      seacAnalysisEnabled
                    );
                    break;
                }
              }

              if (glyf) {
                var fontMatrix = !unitsPerEm
                  ? font.fontMatrix
                  : [1 / unitsPerEm, 0, 0, 1 / unitsPerEm, 0, 0];
                return new TrueTypeCompiled(
                  parseGlyfTable(glyf, loca, indexToLocFormat),
                  cmap,
                  fontMatrix
                );
              }

              return new Type2Compiled(
                cff,
                cmap,
                font.fontMatrix,
                font.glyphNameMap
              );
            }

};
