          var BitModel = (function BitModelClosure() {
            var UNIFORM_CONTEXT = 17;
            var RUNLENGTH_CONTEXT = 18;
            var LLAndLHContextsLabel = new Uint8Array([
              0,
              5,
              8,
              0,
              3,
              7,
              8,
              0,
              4,
              7,
              8,
              0,
              0,
              0,
              0,
              0,
              1,
              6,
              8,
              0,
              3,
              7,
              8,
              0,
              4,
              7,
              8,
              0,
              0,
              0,
              0,
              0,
              2,
              6,
              8,
              0,
              3,
              7,
              8,
              0,
              4,
              7,
              8,
              0,
              0,
              0,
              0,
              0,
              2,
              6,
              8,
              0,
              3,
              7,
              8,
              0,
              4,
              7,
              8,
              0,
              0,
              0,
              0,
              0,
              2,
              6,
              8,
              0,
              3,
              7,
              8,
              0,
              4,
              7,
              8
            ]);
            var HLContextLabel = new Uint8Array([
              0,
              3,
              4,
              0,
              5,
              7,
              7,
              0,
              8,
              8,
              8,
              0,
              0,
              0,
              0,
              0,
              1,
              3,
              4,
              0,
              6,
              7,
              7,
              0,
              8,
              8,
              8,
              0,
              0,
              0,
              0,
              0,
              2,
              3,
              4,
              0,
              6,
              7,
              7,
              0,
              8,
              8,
              8,
              0,
              0,
              0,
              0,
              0,
              2,
              3,
              4,
              0,
              6,
              7,
              7,
              0,
              8,
              8,
              8,
              0,
              0,
              0,
              0,
              0,
              2,
              3,
              4,
              0,
              6,
              7,
              7,
              0,
              8,
              8,
              8
            ]);
            var HHContextLabel = new Uint8Array([
              0,
              1,
              2,
              0,
              1,
              2,
              2,
              0,
              2,
              2,
              2,
              0,
              0,
              0,
              0,
              0,
              3,
              4,
              5,
              0,
              4,
              5,
              5,
              0,
              5,
              5,
              5,
              0,
              0,
              0,
              0,
              0,
              6,
              7,
              7,
              0,
              7,
              7,
              7,
              0,
              7,
              7,
              7,
              0,
              0,
              0,
              0,
              0,
              8,
              8,
              8,
              0,
              8,
              8,
              8,
              0,
              8,
              8,
              8,
              0,
              0,
              0,
              0,
              0,
              8,
              8,
              8,
              0,
              8,
              8,
              8,
              0,
              8,
              8,
              8
            ]);

            function BitModel(width, height, subband, zeroBitPlanes, mb) {
              this.width = width;
              this.height = height;
              this.contextLabelTable =
                subband === "HH"
                  ? HHContextLabel
                  : subband === "HL"
                  ? HLContextLabel
                  : LLAndLHContextsLabel;
              var coefficientCount = width * height;
              this.neighborsSignificance = new Uint8Array(coefficientCount);
              this.coefficentsSign = new Uint8Array(coefficientCount);
              this.coefficentsMagnitude =
                mb > 14
                  ? new Uint32Array(coefficientCount)
                  : mb > 6
                  ? new Uint16Array(coefficientCount)
                  : new Uint8Array(coefficientCount);
              this.processingFlags = new Uint8Array(coefficientCount);
              var bitsDecoded = new Uint8Array(coefficientCount);

              if (zeroBitPlanes !== 0) {
                for (var i = 0; i < coefficientCount; i++) {
                  bitsDecoded[i] = zeroBitPlanes;
                }
              }

              this.bitsDecoded = bitsDecoded;
              this.reset();
            }

            BitModel.prototype = {
              setDecoder: function BitModel_setDecoder(decoder) {
                this.decoder = decoder;
              },
              reset: function BitModel_reset() {
                this.contexts = new Int8Array(19);
                this.contexts[0] = (4 << 1) | 0;
                this.contexts[UNIFORM_CONTEXT] = (46 << 1) | 0;
                this.contexts[RUNLENGTH_CONTEXT] = (3 << 1) | 0;
              },
              setNeighborsSignificance: function BitModel_setNeighborsSignificance(
                row,
                column,
                index
              ) {
                var neighborsSignificance = this.neighborsSignificance;
                var width = this.width,
                  height = this.height;
                var left = column > 0;
                var right = column + 1 < width;
                var i;

                if (row > 0) {
                  i = index - width;

                  if (left) {
                    neighborsSignificance[i - 1] += 0x10;
                  }

                  if (right) {
                    neighborsSignificance[i + 1] += 0x10;
                  }

                  neighborsSignificance[i] += 0x04;
                }

                if (row + 1 < height) {
                  i = index + width;

                  if (left) {
                    neighborsSignificance[i - 1] += 0x10;
                  }

                  if (right) {
                    neighborsSignificance[i + 1] += 0x10;
                  }

                  neighborsSignificance[i] += 0x04;
                }

                if (left) {
                  neighborsSignificance[index - 1] += 0x01;
                }

                if (right) {
                  neighborsSignificance[index + 1] += 0x01;
                }

                neighborsSignificance[index] |= 0x80;
              },
              runSignificancePropagationPass: function BitModel_runSignificancePropagationPass() {
                var decoder = this.decoder;
                var width = this.width,
                  height = this.height;
                var coefficentsMagnitude = this.coefficentsMagnitude;
                var coefficentsSign = this.coefficentsSign;
                var neighborsSignificance = this.neighborsSignificance;
                var processingFlags = this.processingFlags;
                var contexts = this.contexts;
                var labels = this.contextLabelTable;
                var bitsDecoded = this.bitsDecoded;
                var processedInverseMask = ~1;
                var processedMask = 1;
                var firstMagnitudeBitMask = 2;

                for (var i0 = 0; i0 < height; i0 += 4) {
                  for (var j = 0; j < width; j++) {
                    var index = i0 * width + j;

                    for (var i1 = 0; i1 < 4; i1++, index += width) {
                      var i = i0 + i1;

                      if (i >= height) {
                        break;
                      }

                      processingFlags[index] &= processedInverseMask;

                      if (
                        coefficentsMagnitude[index] ||
                        !neighborsSignificance[index]
                      ) {
                        continue;
                      }

                      var contextLabel = labels[neighborsSignificance[index]];
                      var decision = decoder.readBit(contexts, contextLabel);

                      if (decision) {
                        var sign = this.decodeSignBit(i, j, index);
                        coefficentsSign[index] = sign;
                        coefficentsMagnitude[index] = 1;
                        this.setNeighborsSignificance(i, j, index);
                        processingFlags[index] |= firstMagnitudeBitMask;
                      }

                      bitsDecoded[index]++;
                      processingFlags[index] |= processedMask;
                    }
                  }
                }
              },
              decodeSignBit: function BitModel_decodeSignBit(
                row,
                column,
                index
              ) {
                var width = this.width,
                  height = this.height;
                var coefficentsMagnitude = this.coefficentsMagnitude;
                var coefficentsSign = this.coefficentsSign;
                var contribution, sign0, sign1, significance1;
                var contextLabel, decoded;
                significance1 =
                  column > 0 && coefficentsMagnitude[index - 1] !== 0;

                if (
                  column + 1 < width &&
                  coefficentsMagnitude[index + 1] !== 0
                ) {
                  sign1 = coefficentsSign[index + 1];

                  if (significance1) {
                    sign0 = coefficentsSign[index - 1];
                    contribution = 1 - sign1 - sign0;
                  } else {
                    contribution = 1 - sign1 - sign1;
                  }
                } else if (significance1) {
                  sign0 = coefficentsSign[index - 1];
                  contribution = 1 - sign0 - sign0;
                } else {
                  contribution = 0;
                }

                var horizontalContribution = 3 * contribution;
                significance1 =
                  row > 0 && coefficentsMagnitude[index - width] !== 0;

                if (
                  row + 1 < height &&
                  coefficentsMagnitude[index + width] !== 0
                ) {
                  sign1 = coefficentsSign[index + width];

                  if (significance1) {
                    sign0 = coefficentsSign[index - width];
                    contribution = 1 - sign1 - sign0 + horizontalContribution;
                  } else {
                    contribution = 1 - sign1 - sign1 + horizontalContribution;
                  }
                } else if (significance1) {
                  sign0 = coefficentsSign[index - width];
                  contribution = 1 - sign0 - sign0 + horizontalContribution;
                } else {
                  contribution = horizontalContribution;
                }

                if (contribution >= 0) {
                  contextLabel = 9 + contribution;
                  decoded = this.decoder.readBit(this.contexts, contextLabel);
                } else {
                  contextLabel = 9 - contribution;
                  decoded =
                    this.decoder.readBit(this.contexts, contextLabel) ^ 1;
                }

                return decoded;
              },
              runMagnitudeRefinementPass: function BitModel_runMagnitudeRefinementPass() {
                var decoder = this.decoder;
                var width = this.width,
                  height = this.height;
                var coefficentsMagnitude = this.coefficentsMagnitude;
                var neighborsSignificance = this.neighborsSignificance;
                var contexts = this.contexts;
                var bitsDecoded = this.bitsDecoded;
                var processingFlags = this.processingFlags;
                var processedMask = 1;
                var firstMagnitudeBitMask = 2;
                var length = width * height;
                var width4 = width * 4;

                for (
                  var index0 = 0, indexNext;
                  index0 < length;
                  index0 = indexNext
                ) {
                  indexNext = Math.min(length, index0 + width4);

                  for (var j = 0; j < width; j++) {
                    for (
                      var index = index0 + j;
                      index < indexNext;
                      index += width
                    ) {
                      if (
                        !coefficentsMagnitude[index] ||
                        (processingFlags[index] & processedMask) !== 0
                      ) {
                        continue;
                      }

                      var contextLabel = 16;

                      if (
                        (processingFlags[index] & firstMagnitudeBitMask) !==
                        0
                      ) {
                        processingFlags[index] ^= firstMagnitudeBitMask;
                        var significance = neighborsSignificance[index] & 127;
                        contextLabel = significance === 0 ? 15 : 14;
                      }

                      var bit = decoder.readBit(contexts, contextLabel);
                      coefficentsMagnitude[index] =
                        (coefficentsMagnitude[index] << 1) | bit;
                      bitsDecoded[index]++;
                      processingFlags[index] |= processedMask;
                    }
                  }
                }
              },
              runCleanupPass: function BitModel_runCleanupPass() {
                var decoder = this.decoder;
                var width = this.width,
                  height = this.height;
                var neighborsSignificance = this.neighborsSignificance;
                var coefficentsMagnitude = this.coefficentsMagnitude;
                var coefficentsSign = this.coefficentsSign;
                var contexts = this.contexts;
                var labels = this.contextLabelTable;
                var bitsDecoded = this.bitsDecoded;
                var processingFlags = this.processingFlags;
                var processedMask = 1;
                var firstMagnitudeBitMask = 2;
                var oneRowDown = width;
                var twoRowsDown = width * 2;
                var threeRowsDown = width * 3;
                var iNext;

                for (var i0 = 0; i0 < height; i0 = iNext) {
                  iNext = Math.min(i0 + 4, height);
                  var indexBase = i0 * width;
                  var checkAllEmpty = i0 + 3 < height;

                  for (var j = 0; j < width; j++) {
                    var index0 = indexBase + j;
                    var allEmpty =
                      checkAllEmpty &&
                      processingFlags[index0] === 0 &&
                      processingFlags[index0 + oneRowDown] === 0 &&
                      processingFlags[index0 + twoRowsDown] === 0 &&
                      processingFlags[index0 + threeRowsDown] === 0 &&
                      neighborsSignificance[index0] === 0 &&
                      neighborsSignificance[index0 + oneRowDown] === 0 &&
                      neighborsSignificance[index0 + twoRowsDown] === 0 &&
                      neighborsSignificance[index0 + threeRowsDown] === 0;
                    var i1 = 0,
                      index = index0;
                    var i = i0,
                      sign;

                    if (allEmpty) {
                      var hasSignificantCoefficent = decoder.readBit(
                        contexts,
                        RUNLENGTH_CONTEXT
                      );

                      if (!hasSignificantCoefficent) {
                        bitsDecoded[index0]++;
                        bitsDecoded[index0 + oneRowDown]++;
                        bitsDecoded[index0 + twoRowsDown]++;
                        bitsDecoded[index0 + threeRowsDown]++;
                        continue;
                      }

                      i1 =
                        (decoder.readBit(contexts, UNIFORM_CONTEXT) << 1) |
                        decoder.readBit(contexts, UNIFORM_CONTEXT);

                      if (i1 !== 0) {
                        i = i0 + i1;
                        index += i1 * width;
                      }

                      sign = this.decodeSignBit(i, j, index);
                      coefficentsSign[index] = sign;
                      coefficentsMagnitude[index] = 1;
                      this.setNeighborsSignificance(i, j, index);
                      processingFlags[index] |= firstMagnitudeBitMask;
                      index = index0;

                      for (var i2 = i0; i2 <= i; i2++, index += width) {
                        bitsDecoded[index]++;
                      }

                      i1++;
                    }

                    for (i = i0 + i1; i < iNext; i++, index += width) {
                      if (
                        coefficentsMagnitude[index] ||
                        (processingFlags[index] & processedMask) !== 0
                      ) {
                        continue;
                      }

                      var contextLabel = labels[neighborsSignificance[index]];
                      var decision = decoder.readBit(contexts, contextLabel);

                      if (decision === 1) {
                        sign = this.decodeSignBit(i, j, index);
                        coefficentsSign[index] = sign;
                        coefficentsMagnitude[index] = 1;
                        this.setNeighborsSignificance(i, j, index);
                        processingFlags[index] |= firstMagnitudeBitMask;
                      }

                      bitsDecoded[index]++;
                    }
                  }
                }
              },
              checkSegmentationSymbol: function BitModel_checkSegmentationSymbol() {
                var decoder = this.decoder;
                var contexts = this.contexts;
                var symbol =
                  (decoder.readBit(contexts, UNIFORM_CONTEXT) << 3) |
                  (decoder.readBit(contexts, UNIFORM_CONTEXT) << 2) |
                  (decoder.readBit(contexts, UNIFORM_CONTEXT) << 1) |
                  decoder.readBit(contexts, UNIFORM_CONTEXT);

                if (symbol !== 0xa) {
                  throw new JpxError("Invalid segmentation symbol");
                }
              }
            };
            return BitModel;
          })();
