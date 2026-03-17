          function decodeTextRegion(
            huffman,
            refinement,
            width,
            height,
            defaultPixelValue,
            numberOfSymbolInstances,
            stripSize,
            inputSymbols,
            symbolCodeLength,
            transposed,
            dsOffset,
            referenceCorner,
            combinationOperator,
            huffmanTables,
            refinementTemplateIndex,
            refinementAt,
            decodingContext,
            logStripSize,
            huffmanInput
          ) {
            if (huffman && refinement) {
              throw new Jbig2Error("refinement with Huffman is not supported");
            }

            var bitmap = [];
            var i, row;

            for (i = 0; i < height; i++) {
              row = new Uint8Array(width);

              if (defaultPixelValue) {
                for (var j = 0; j < width; j++) {
                  row[j] = defaultPixelValue;
                }
              }

              bitmap.push(row);
            }

            var decoder = decodingContext.decoder;
            var contextCache = decodingContext.contextCache;
            var stripT = huffman
              ? -huffmanTables.tableDeltaT.decode(huffmanInput)
              : -decodeInteger(contextCache, "IADT", decoder);
            var firstS = 0;
            i = 0;

            while (i < numberOfSymbolInstances) {
              var deltaT = huffman
                ? huffmanTables.tableDeltaT.decode(huffmanInput)
                : decodeInteger(contextCache, "IADT", decoder);
              stripT += deltaT;
              var deltaFirstS = huffman
                ? huffmanTables.tableFirstS.decode(huffmanInput)
                : decodeInteger(contextCache, "IAFS", decoder);
              firstS += deltaFirstS;
              var currentS = firstS;

              do {
                var currentT = 0;

                if (stripSize > 1) {
                  currentT = huffman
                    ? huffmanInput.readBits(logStripSize)
                    : decodeInteger(contextCache, "IAIT", decoder);
                }

                var t = stripSize * stripT + currentT;
                var symbolId = huffman
                  ? huffmanTables.symbolIDTable.decode(huffmanInput)
                  : decodeIAID(contextCache, decoder, symbolCodeLength);
                var applyRefinement =
                  refinement &&
                  (huffman
                    ? huffmanInput.readBit()
                    : decodeInteger(contextCache, "IARI", decoder));
                var symbolBitmap = inputSymbols[symbolId];
                var symbolWidth = symbolBitmap[0].length;
                var symbolHeight = symbolBitmap.length;

                if (applyRefinement) {
                  var rdw = decodeInteger(contextCache, "IARDW", decoder);
                  var rdh = decodeInteger(contextCache, "IARDH", decoder);
                  var rdx = decodeInteger(contextCache, "IARDX", decoder);
                  var rdy = decodeInteger(contextCache, "IARDY", decoder);
                  symbolWidth += rdw;
                  symbolHeight += rdh;
                  symbolBitmap = decodeRefinement(
                    symbolWidth,
                    symbolHeight,
                    refinementTemplateIndex,
                    symbolBitmap,
                    (rdw >> 1) + rdx,
                    (rdh >> 1) + rdy,
                    false,
                    refinementAt,
                    decodingContext
                  );
                }

                var offsetT = t - (referenceCorner & 1 ? 0 : symbolHeight - 1);
                var offsetS =
                  currentS - (referenceCorner & 2 ? symbolWidth - 1 : 0);
                var s2, t2, symbolRow;

                if (transposed) {
                  for (s2 = 0; s2 < symbolHeight; s2++) {
                    row = bitmap[offsetS + s2];

                    if (!row) {
                      continue;
                    }

                    symbolRow = symbolBitmap[s2];
                    var maxWidth = Math.min(width - offsetT, symbolWidth);

                    switch (combinationOperator) {
                      case 0:
                        for (t2 = 0; t2 < maxWidth; t2++) {
                          row[offsetT + t2] |= symbolRow[t2];
                        }

                        break;

                      case 2:
                        for (t2 = 0; t2 < maxWidth; t2++) {
                          row[offsetT + t2] ^= symbolRow[t2];
                        }

                        break;

                      default:
                        throw new Jbig2Error(
                          "operator ".concat(
                            combinationOperator,
                            " is not supported"
                          )
                        );
                    }
                  }

                  currentS += symbolHeight - 1;
                } else {
                  for (t2 = 0; t2 < symbolHeight; t2++) {
                    row = bitmap[offsetT + t2];

                    if (!row) {
                      continue;
                    }

                    symbolRow = symbolBitmap[t2];

                    switch (combinationOperator) {
                      case 0:
                        for (s2 = 0; s2 < symbolWidth; s2++) {
                          row[offsetS + s2] |= symbolRow[s2];
                        }

                        break;

                      case 2:
                        for (s2 = 0; s2 < symbolWidth; s2++) {
                          row[offsetS + s2] ^= symbolRow[s2];
                        }

                        break;

                      default:
                        throw new Jbig2Error(
                          "operator ".concat(
                            combinationOperator,
                            " is not supported"
                          )
                        );
                    }
                  }

                  currentS += symbolWidth - 1;
                }

                i++;
                var deltaS = huffman
                  ? huffmanTables.tableDeltaS.decode(huffmanInput)
                  : decodeInteger(contextCache, "IADS", decoder);

                if (deltaS === null) {
                  break;
                }

                currentS += deltaS + dsOffset;
              } while (true);
            }

            return bitmap;
          }
