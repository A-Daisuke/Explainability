            function encode(imgData, kind, forceDataSchema, isMask) {
              var width = imgData.width;
              var height = imgData.height;
              var bitDepth, colorType, lineSize;
              var bytes = imgData.data;

              switch (kind) {
                case _util.ImageKind.GRAYSCALE_1BPP:
                  colorType = 0;
                  bitDepth = 1;
                  lineSize = (width + 7) >> 3;
                  break;

                case _util.ImageKind.RGB_24BPP:
                  colorType = 2;
                  bitDepth = 8;
                  lineSize = width * 3;
                  break;

                case _util.ImageKind.RGBA_32BPP:
                  colorType = 6;
                  bitDepth = 8;
                  lineSize = width * 4;
                  break;

                default:
                  throw new Error("invalid format");
              }

              var literals = new Uint8Array((1 + lineSize) * height);
              var offsetLiterals = 0,
                offsetBytes = 0;
              var y, i;

              for (y = 0; y < height; ++y) {
                literals[offsetLiterals++] = 0;
                literals.set(
                  bytes.subarray(offsetBytes, offsetBytes + lineSize),
                  offsetLiterals
                );
                offsetBytes += lineSize;
                offsetLiterals += lineSize;
              }

              if (kind === _util.ImageKind.GRAYSCALE_1BPP && isMask) {
                offsetLiterals = 0;

                for (y = 0; y < height; y++) {
                  offsetLiterals++;

                  for (i = 0; i < lineSize; i++) {
                    literals[offsetLiterals++] ^= 0xff;
                  }
                }
              }

              var ihdr = new Uint8Array([
                (width >> 24) & 0xff,
                (width >> 16) & 0xff,
                (width >> 8) & 0xff,
                width & 0xff,
                (height >> 24) & 0xff,
                (height >> 16) & 0xff,
                (height >> 8) & 0xff,
                height & 0xff,
                bitDepth,
                colorType,
                0x00,
                0x00,
                0x00
              ]);
              var idat = deflateSync(literals);
              var pngLength =
                PNG_HEADER.length +
                CHUNK_WRAPPER_SIZE * 3 +
                ihdr.length +
                idat.length;
              var data = new Uint8Array(pngLength);
              var offset = 0;
              data.set(PNG_HEADER, offset);
              offset += PNG_HEADER.length;
              writePngChunk("IHDR", ihdr, data, offset);
              offset += CHUNK_WRAPPER_SIZE + ihdr.length;
              writePngChunk("IDATA", idat, data, offset);
              offset += CHUNK_WRAPPER_SIZE + idat.length;
              writePngChunk("IEND", new Uint8Array(0), data, offset);
              return (0, _util.createObjectURL)(
                data,
                "image/png",
                forceDataSchema
              );
            }
