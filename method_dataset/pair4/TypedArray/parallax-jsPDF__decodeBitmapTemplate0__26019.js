          function decodeBitmapTemplate0(width, height, decodingContext) {
            var decoder = decodingContext.decoder;
            var contexts = decodingContext.contextCache.getContexts("GB");
            var contextLabel,
              i,
              j,
              pixel,
              row,
              row1,
              row2,
              bitmap = [];
            var OLD_PIXEL_MASK = 0x7bf7;

            for (i = 0; i < height; i++) {
              row = bitmap[i] = new Uint8Array(width);
              row1 = i < 1 ? row : bitmap[i - 1];
              row2 = i < 2 ? row : bitmap[i - 2];
              contextLabel =
                (row2[0] << 13) |
                (row2[1] << 12) |
                (row2[2] << 11) |
                (row1[0] << 7) |
                (row1[1] << 6) |
                (row1[2] << 5) |
                (row1[3] << 4);

              for (j = 0; j < width; j++) {
                row[j] = pixel = decoder.readBit(contexts, contextLabel);
                contextLabel =
                  ((contextLabel & OLD_PIXEL_MASK) << 1) |
                  (j + 3 < width ? row2[j + 3] << 11 : 0) |
                  (j + 4 < width ? row1[j + 4] << 4 : 0) |
                  pixel;
              }
            }

            return bitmap;
          }
