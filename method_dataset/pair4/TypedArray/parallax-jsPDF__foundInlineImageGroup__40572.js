            function foundInlineImageGroup(context, i) {
              var MIN_IMAGES_IN_INLINE_IMAGES_BLOCK = 10;
              var MAX_IMAGES_IN_INLINE_IMAGES_BLOCK = 200;
              var MAX_WIDTH = 1000;
              var IMAGE_PADDING = 1;
              var fnArray = context.fnArray,
                argsArray = context.argsArray;
              var curr = context.iCurr;
              var iFirstSave = curr - 3;
              var iFirstTransform = curr - 2;
              var iFirstPIIXO = curr - 1;
              var count = Math.min(
                Math.floor((i - iFirstSave) / 4),
                MAX_IMAGES_IN_INLINE_IMAGES_BLOCK
              );

              if (count < MIN_IMAGES_IN_INLINE_IMAGES_BLOCK) {
                return i - ((i - iFirstSave) % 4);
              }

              var maxX = 0;
              var map = [],
                maxLineHeight = 0;
              var currentX = IMAGE_PADDING,
                currentY = IMAGE_PADDING;
              var q;

              for (q = 0; q < count; q++) {
                var transform = argsArray[iFirstTransform + (q << 2)];
                var img = argsArray[iFirstPIIXO + (q << 2)][0];

                if (currentX + img.width > MAX_WIDTH) {
                  maxX = Math.max(maxX, currentX);
                  currentY += maxLineHeight + 2 * IMAGE_PADDING;
                  currentX = 0;
                  maxLineHeight = 0;
                }

                map.push({
                  transform: transform,
                  x: currentX,
                  y: currentY,
                  w: img.width,
                  h: img.height
                });
                currentX += img.width + 2 * IMAGE_PADDING;
                maxLineHeight = Math.max(maxLineHeight, img.height);
              }

              var imgWidth = Math.max(maxX, currentX) + IMAGE_PADDING;
              var imgHeight = currentY + maxLineHeight + IMAGE_PADDING;
              var imgData = new Uint8ClampedArray(imgWidth * imgHeight * 4);
              var imgRowSize = imgWidth << 2;

              for (q = 0; q < count; q++) {
                var data = argsArray[iFirstPIIXO + (q << 2)][0].data;
                var rowSize = map[q].w << 2;
                var dataOffset = 0;
                var offset = (map[q].x + map[q].y * imgWidth) << 2;
                imgData.set(data.subarray(0, rowSize), offset - imgRowSize);

                for (var k = 0, kk = map[q].h; k < kk; k++) {
                  imgData.set(
                    data.subarray(dataOffset, dataOffset + rowSize),
                    offset
                  );
                  dataOffset += rowSize;
                  offset += imgRowSize;
                }

                imgData.set(
                  data.subarray(dataOffset - rowSize, dataOffset),
                  offset
                );

                while (offset >= 0) {
                  data[offset - 4] = data[offset];
                  data[offset - 3] = data[offset + 1];
                  data[offset - 2] = data[offset + 2];
                  data[offset - 1] = data[offset + 3];
                  data[offset + rowSize] = data[offset + rowSize - 4];
                  data[offset + rowSize + 1] = data[offset + rowSize - 3];
                  data[offset + rowSize + 2] = data[offset + rowSize - 2];
                  data[offset + rowSize + 3] = data[offset + rowSize - 1];
                  offset -= imgRowSize;
                }
              }

              fnArray.splice(
                iFirstSave,
                count * 4,
                _util.OPS.paintInlineImageXObjectGroup
              );
              argsArray.splice(iFirstSave, count * 4, [
                {
                  width: imgWidth,
                  height: imgHeight,
                  kind: _util.ImageKind.RGBA_32BPP,
                  data: imgData
                },
                map
              ]);
              return iFirstSave + 1;
            }
