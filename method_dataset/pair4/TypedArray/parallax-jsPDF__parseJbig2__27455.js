          function parseJbig2(data) {
            var position = 0,
              end = data.length;

            if (
              data[position] !== 0x97 ||
              data[position + 1] !== 0x4a ||
              data[position + 2] !== 0x42 ||
              data[position + 3] !== 0x32 ||
              data[position + 4] !== 0x0d ||
              data[position + 5] !== 0x0a ||
              data[position + 6] !== 0x1a ||
              data[position + 7] !== 0x0a
            ) {
              throw new Jbig2Error("parseJbig2 - invalid header.");
            }

            var header = Object.create(null);
            position += 8;
            var flags = data[position++];
            header.randomAccess = !(flags & 1);

            if (!(flags & 2)) {
              header.numberOfPages = (0, _util.readUint32)(data, position);
              position += 4;
            }

            var segments = readSegments(header, data, position, end);
            var visitor = new SimpleSegmentVisitor();
            processSegments(segments, visitor);
            var _visitor$currentPageI = visitor.currentPageInfo,
              width = _visitor$currentPageI.width,
              height = _visitor$currentPageI.height;
            var bitPacked = visitor.buffer;
            var imgData = new Uint8ClampedArray(width * height);
            var q = 0,
              k = 0;

            for (var i = 0; i < height; i++) {
              var mask = 0,
                buffer = void 0;

              for (var j = 0; j < width; j++) {
                if (!mask) {
                  mask = 128;
                  buffer = bitPacked[k++];
                }

                imgData[q++] = buffer & mask ? 0 : 255;
                mask >>= 1;
              }
            }

            return {
              imgData: imgData,
              width: width,
              height: height
            };
          }
