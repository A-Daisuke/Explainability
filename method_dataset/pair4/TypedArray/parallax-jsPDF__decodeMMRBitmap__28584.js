          function decodeMMRBitmap(input, width, height, endOfBlock) {
            var params = {
              K: -1,
              Columns: width,
              Rows: height,
              BlackIs1: true,
              EndOfBlock: endOfBlock
            };
            var decoder = new _ccitt.CCITTFaxDecoder(input, params);
            var bitmap = [],
              x,
              y,
              row,
              currentByte,
              shift,
              eof = false;

            for (y = 0; y < height; y++) {
              row = new Uint8Array(width);
              bitmap.push(row);
              shift = -1;

              for (x = 0; x < width; x++) {
                if (shift < 0) {
                  currentByte = decoder.readNextChar();

                  if (currentByte === -1) {
                    currentByte = 0;
                    eof = true;
                  }

                  shift = 7;
                }

                row[x] = (currentByte >> shift) & 1;
                shift--;
              }
            }

            if (endOfBlock && !eof) {
              var lookForEOFLimit = 5;

              for (var i = 0; i < lookForEOFLimit; i++) {
                if (decoder.readNextChar() === -1) {
                  break;
                }
              }
            }

            return bitmap;
          }
