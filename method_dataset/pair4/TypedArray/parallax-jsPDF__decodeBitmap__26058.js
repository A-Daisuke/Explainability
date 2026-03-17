          function decodeBitmap(
            mmr,
            width,
            height,
            templateIndex,
            prediction,
            skip,
            at,
            decodingContext
          ) {
            if (mmr) {
              var input = new Reader(
                decodingContext.data,
                decodingContext.start,
                decodingContext.end
              );
              return decodeMMRBitmap(input, width, height, false);
            }

            if (
              templateIndex === 0 &&
              !skip &&
              !prediction &&
              at.length === 4 &&
              at[0].x === 3 &&
              at[0].y === -1 &&
              at[1].x === -3 &&
              at[1].y === -1 &&
              at[2].x === 2 &&
              at[2].y === -2 &&
              at[3].x === -2 &&
              at[3].y === -2
            ) {
              return decodeBitmapTemplate0(width, height, decodingContext);
            }

            var useskip = !!skip;
            var template = CodingTemplates[templateIndex].concat(at);
            template.sort(function(a, b) {
              return a.y - b.y || a.x - b.x;
            });
            var templateLength = template.length;
            var templateX = new Int8Array(templateLength);
            var templateY = new Int8Array(templateLength);
            var changingTemplateEntries = [];
            var reuseMask = 0,
              minX = 0,
              maxX = 0,
              minY = 0;
            var c, k;

            for (k = 0; k < templateLength; k++) {
              templateX[k] = template[k].x;
              templateY[k] = template[k].y;
              minX = Math.min(minX, template[k].x);
              maxX = Math.max(maxX, template[k].x);
              minY = Math.min(minY, template[k].y);

              if (
                k < templateLength - 1 &&
                template[k].y === template[k + 1].y &&
                template[k].x === template[k + 1].x - 1
              ) {
                reuseMask |= 1 << (templateLength - 1 - k);
              } else {
                changingTemplateEntries.push(k);
              }
            }

            var changingEntriesLength = changingTemplateEntries.length;
            var changingTemplateX = new Int8Array(changingEntriesLength);
            var changingTemplateY = new Int8Array(changingEntriesLength);
            var changingTemplateBit = new Uint16Array(changingEntriesLength);

            for (c = 0; c < changingEntriesLength; c++) {
              k = changingTemplateEntries[c];
              changingTemplateX[c] = template[k].x;
              changingTemplateY[c] = template[k].y;
              changingTemplateBit[c] = 1 << (templateLength - 1 - k);
            }

            var sbb_left = -minX;
            var sbb_top = -minY;
            var sbb_right = width - maxX;
            var pseudoPixelContext = ReusedContexts[templateIndex];
            var row = new Uint8Array(width);
            var bitmap = [];
            var decoder = decodingContext.decoder;
            var contexts = decodingContext.contextCache.getContexts("GB");
            var ltp = 0,
              j,
              i0,
              j0,
              contextLabel = 0,
              bit,
              shift;

            for (var i = 0; i < height; i++) {
              if (prediction) {
                var sltp = decoder.readBit(contexts, pseudoPixelContext);
                ltp ^= sltp;

                if (ltp) {
                  bitmap.push(row);
                  continue;
                }
              }

              row = new Uint8Array(row);
              bitmap.push(row);

              for (j = 0; j < width; j++) {
                if (useskip && skip[i][j]) {
                  row[j] = 0;
                  continue;
                }

                if (j >= sbb_left && j < sbb_right && i >= sbb_top) {
                  contextLabel = (contextLabel << 1) & reuseMask;

                  for (k = 0; k < changingEntriesLength; k++) {
                    i0 = i + changingTemplateY[k];
                    j0 = j + changingTemplateX[k];
                    bit = bitmap[i0][j0];

                    if (bit) {
                      bit = changingTemplateBit[k];
                      contextLabel |= bit;
                    }
                  }
                } else {
                  contextLabel = 0;
                  shift = templateLength - 1;

                  for (k = 0; k < templateLength; k++, shift--) {
                    j0 = j + templateX[k];

                    if (j0 >= 0 && j0 < width) {
                      i0 = i + templateY[k];

                      if (i0 >= 0) {
                        bit = bitmap[i0][j0];

                        if (bit) {
                          contextLabel |= bit << shift;
                        }
                      }
                    }
                  }
                }

                var pixel = decoder.readBit(contexts, contextLabel);
                row[j] = pixel;
              }
            }

            return bitmap;
          }
