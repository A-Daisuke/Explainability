          function copyCoefficients(
            coefficients,
            levelWidth,
            levelHeight,
            subband,
            delta,
            mb,
            reversible,
            segmentationSymbolUsed
          ) {
            var x0 = subband.tbx0;
            var y0 = subband.tby0;
            var width = subband.tbx1 - subband.tbx0;
            var codeblocks = subband.codeblocks;
            var right = subband.type.charAt(0) === "H" ? 1 : 0;
            var bottom = subband.type.charAt(1) === "H" ? levelWidth : 0;

            for (var i = 0, ii = codeblocks.length; i < ii; ++i) {
              var codeblock = codeblocks[i];
              var blockWidth = codeblock.tbx1_ - codeblock.tbx0_;
              var blockHeight = codeblock.tby1_ - codeblock.tby0_;

              if (blockWidth === 0 || blockHeight === 0) {
                continue;
              }

              if (codeblock["data"] === undefined) {
                continue;
              }

              var bitModel, currentCodingpassType;
              bitModel = new BitModel(
                blockWidth,
                blockHeight,
                codeblock.subbandType,
                codeblock.zeroBitPlanes,
                mb
              );
              currentCodingpassType = 2;
              var data = codeblock.data,
                totalLength = 0,
                codingpasses = 0;
              var j, jj, dataItem;

              for (j = 0, jj = data.length; j < jj; j++) {
                dataItem = data[j];
                totalLength += dataItem.end - dataItem.start;
                codingpasses += dataItem.codingpasses;
              }

              var encodedData = new Uint8Array(totalLength);
              var position = 0;

              for (j = 0, jj = data.length; j < jj; j++) {
                dataItem = data[j];
                var chunk = dataItem.data.subarray(
                  dataItem.start,
                  dataItem.end
                );
                encodedData.set(chunk, position);
                position += chunk.length;
              }

              var decoder = new _arithmetic_decoder.ArithmeticDecoder(
                encodedData,
                0,
                totalLength
              );
              bitModel.setDecoder(decoder);

              for (j = 0; j < codingpasses; j++) {
                switch (currentCodingpassType) {
                  case 0:
                    bitModel.runSignificancePropagationPass();
                    break;

                  case 1:
                    bitModel.runMagnitudeRefinementPass();
                    break;

                  case 2:
                    bitModel.runCleanupPass();

                    if (segmentationSymbolUsed) {
                      bitModel.checkSegmentationSymbol();
                    }

                    break;
                }

                currentCodingpassType = (currentCodingpassType + 1) % 3;
              }

              var offset =
                codeblock.tbx0_ - x0 + (codeblock.tby0_ - y0) * width;
              var sign = bitModel.coefficentsSign;
              var magnitude = bitModel.coefficentsMagnitude;
              var bitsDecoded = bitModel.bitsDecoded;
              var magnitudeCorrection = reversible ? 0 : 0.5;
              var k, n, nb;
              position = 0;
              var interleave = subband.type !== "LL";

              for (j = 0; j < blockHeight; j++) {
                var row = (offset / width) | 0;
                var levelOffset =
                  2 * row * (levelWidth - width) + right + bottom;

                for (k = 0; k < blockWidth; k++) {
                  n = magnitude[position];

                  if (n !== 0) {
                    n = (n + magnitudeCorrection) * delta;

                    if (sign[position] !== 0) {
                      n = -n;
                    }

                    nb = bitsDecoded[position];
                    var pos = interleave ? levelOffset + (offset << 1) : offset;

                    if (reversible && nb >= mb) {
                      coefficients[pos] = n;
                    } else {
                      coefficients[pos] = n * (1 << (mb - nb));
                    }
                  }

                  offset++;
                  position++;
                }

                offset += width - blockWidth;
              }
            }
          }
