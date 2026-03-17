          function putBinaryImageData(ctx, imgData) {
            if (
              typeof ImageData !== "undefined" &&
              imgData instanceof ImageData
            ) {
              ctx.putImageData(imgData, 0, 0);
              return;
            }

            var height = imgData.height,
              width = imgData.width;
            var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
            var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
            var totalChunks =
              partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
            var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
            var srcPos = 0,
              destPos;
            var src = imgData.data;
            var dest = chunkImgData.data;
            var i, j, thisChunkHeight, elemsInThisChunk;

            if (imgData.kind === _util.ImageKind.GRAYSCALE_1BPP) {
              var srcLength = src.byteLength;
              var dest32 = new Uint32Array(
                dest.buffer,
                0,
                dest.byteLength >> 2
              );
              var dest32DataLength = dest32.length;
              var fullSrcDiff = (width + 7) >> 3;
              var white = 0xffffffff;
              var black = IsLittleEndianCached.value ? 0xff000000 : 0x000000ff;

              for (i = 0; i < totalChunks; i++) {
                thisChunkHeight =
                  i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
                destPos = 0;

                for (j = 0; j < thisChunkHeight; j++) {
                  var srcDiff = srcLength - srcPos;
                  var k = 0;
                  var kEnd = srcDiff > fullSrcDiff ? width : srcDiff * 8 - 7;
                  var kEndUnrolled = kEnd & ~7;
                  var mask = 0;
                  var srcByte = 0;

                  for (; k < kEndUnrolled; k += 8) {
                    srcByte = src[srcPos++];
                    dest32[destPos++] = srcByte & 128 ? white : black;
                    dest32[destPos++] = srcByte & 64 ? white : black;
                    dest32[destPos++] = srcByte & 32 ? white : black;
                    dest32[destPos++] = srcByte & 16 ? white : black;
                    dest32[destPos++] = srcByte & 8 ? white : black;
                    dest32[destPos++] = srcByte & 4 ? white : black;
                    dest32[destPos++] = srcByte & 2 ? white : black;
                    dest32[destPos++] = srcByte & 1 ? white : black;
                  }

                  for (; k < kEnd; k++) {
                    if (mask === 0) {
                      srcByte = src[srcPos++];
                      mask = 128;
                    }

                    dest32[destPos++] = srcByte & mask ? white : black;
                    mask >>= 1;
                  }
                }

                while (destPos < dest32DataLength) {
                  dest32[destPos++] = 0;
                }

                ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
              }
            } else if (imgData.kind === _util.ImageKind.RGBA_32BPP) {
              j = 0;
              elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;

              for (i = 0; i < fullChunks; i++) {
                dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
                srcPos += elemsInThisChunk;
                ctx.putImageData(chunkImgData, 0, j);
                j += FULL_CHUNK_HEIGHT;
              }

              if (i < totalChunks) {
                elemsInThisChunk = width * partialChunkHeight * 4;
                dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
                ctx.putImageData(chunkImgData, 0, j);
              }
            } else if (imgData.kind === _util.ImageKind.RGB_24BPP) {
              thisChunkHeight = FULL_CHUNK_HEIGHT;
              elemsInThisChunk = width * thisChunkHeight;

              for (i = 0; i < totalChunks; i++) {
                if (i >= fullChunks) {
                  thisChunkHeight = partialChunkHeight;
                  elemsInThisChunk = width * thisChunkHeight;
                }

                destPos = 0;

                for (j = elemsInThisChunk; j--; ) {
                  dest[destPos++] = src[srcPos++];
                  dest[destPos++] = src[srcPos++];
                  dest[destPos++] = src[srcPos++];
                  dest[destPos++] = 255;
                }

                ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
              }
            } else {
              throw new Error("bad image kind: ".concat(imgData.kind));
            }
          }
