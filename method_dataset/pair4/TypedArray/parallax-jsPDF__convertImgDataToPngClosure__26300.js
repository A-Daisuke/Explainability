          var convertImgDataToPng = (function convertImgDataToPngClosure() {
            var PNG_HEADER = new Uint8Array([
              0x89,
              0x50,
              0x4e,
              0x47,
              0x0d,
              0x0a,
              0x1a,
              0x0a
            ]);
            var CHUNK_WRAPPER_SIZE = 12;
            var crcTable = new Int32Array(256);

            for (var i = 0; i < 256; i++) {
              var c = i;

              for (var h = 0; h < 8; h++) {
                if (c & 1) {
                  c = 0xedb88320 ^ ((c >> 1) & 0x7fffffff);
                } else {
                  c = (c >> 1) & 0x7fffffff;
                }
              }

              crcTable[i] = c;
            }

            function crc32(data, start, end) {
              var crc = -1;

              for (var i = start; i < end; i++) {
                var a = (crc ^ data[i]) & 0xff;
                var b = crcTable[a];
                crc = (crc >>> 8) ^ b;
              }

              return crc ^ -1;
            }

            function writePngChunk(type, body, data, offset) {
              var p = offset;
              var len = body.length;
              data[p] = (len >> 24) & 0xff;
              data[p + 1] = (len >> 16) & 0xff;
              data[p + 2] = (len >> 8) & 0xff;
              data[p + 3] = len & 0xff;
              p += 4;
              data[p] = type.charCodeAt(0) & 0xff;
              data[p + 1] = type.charCodeAt(1) & 0xff;
              data[p + 2] = type.charCodeAt(2) & 0xff;
              data[p + 3] = type.charCodeAt(3) & 0xff;
              p += 4;
              data.set(body, p);
              p += body.length;
              var crc = crc32(data, offset + 4, p);
              data[p] = (crc >> 24) & 0xff;
              data[p + 1] = (crc >> 16) & 0xff;
              data[p + 2] = (crc >> 8) & 0xff;
              data[p + 3] = crc & 0xff;
            }

            function adler32(data, start, end) {
              var a = 1;
              var b = 0;

              for (var i = start; i < end; ++i) {
                a = (a + (data[i] & 0xff)) % 65521;
                b = (b + a) % 65521;
              }

              return (b << 16) | a;
            }

            function deflateSync(literals) {
              if (!(0, _is_node.default)()) {
                return deflateSyncUncompressed(literals);
              }

              try {
                var input;

                if (parseInt(process.versions.node) >= 8) {
                  input = literals;
                } else {
                  input = new Buffer(literals);
                }

                var output = require("zlib").deflateSync(input, {
                  level: 9
                });

                return output instanceof Uint8Array
                  ? output
                  : new Uint8Array(output);
              } catch (e) {
                (0, _util.warn)(
                  "Not compressing PNG because zlib.deflateSync is unavailable: " +
                    e
                );
              }

              return deflateSyncUncompressed(literals);
            }

            function deflateSyncUncompressed(literals) {
              var len = literals.length;
              var maxBlockLength = 0xffff;
              var deflateBlocks = Math.ceil(len / maxBlockLength);
              var idat = new Uint8Array(2 + len + deflateBlocks * 5 + 4);
              var pi = 0;
              idat[pi++] = 0x78;
              idat[pi++] = 0x9c;
              var pos = 0;

              while (len > maxBlockLength) {
                idat[pi++] = 0x00;
                idat[pi++] = 0xff;
                idat[pi++] = 0xff;
                idat[pi++] = 0x00;
                idat[pi++] = 0x00;
                idat.set(literals.subarray(pos, pos + maxBlockLength), pi);
                pi += maxBlockLength;
                pos += maxBlockLength;
                len -= maxBlockLength;
              }

              idat[pi++] = 0x01;
              idat[pi++] = len & 0xff;
              idat[pi++] = (len >> 8) & 0xff;
              idat[pi++] = ~len & 0xffff & 0xff;
              idat[pi++] = ((~len & 0xffff) >> 8) & 0xff;
              idat.set(literals.subarray(pos), pi);
              pi += literals.length - pos;
              var adler = adler32(literals, 0, literals.length);
              idat[pi++] = (adler >> 24) & 0xff;
              idat[pi++] = (adler >> 16) & 0xff;
              idat[pi++] = (adler >> 8) & 0xff;
              idat[pi++] = adler & 0xff;
              return idat;
            }

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

            return function convertImgDataToPng(
              imgData,
              forceDataSchema,
              isMask
            ) {
              var kind =
                imgData.kind === undefined
                  ? _util.ImageKind.GRAYSCALE_1BPP
                  : imgData.kind;
              return encode(imgData, kind, forceDataSchema, isMask);
            };
          })();
