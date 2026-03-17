          function readUncompressedBitmap(reader, width, height) {
            var bitmap = [],
              x,
              y,
              row;

            for (y = 0; y < height; y++) {
              row = new Uint8Array(width);
              bitmap.push(row);

              for (x = 0; x < width; x++) {
                row[x] = reader.readBit();
              }

              reader.byteAlign();
            }

            return bitmap;
          }
