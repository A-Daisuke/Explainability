          function processSegment(segment, visitor) {
            var header = segment.header;
            var data = segment.data,
              position = segment.start,
              end = segment.end;
            var args, at, i, atLength;

            switch (header.type) {
              case 0:
                var dictionary = {};
                var dictionaryFlags = (0, _util.readUint16)(data, position);
                dictionary.huffman = !!(dictionaryFlags & 1);
                dictionary.refinement = !!(dictionaryFlags & 2);
                dictionary.huffmanDHSelector = (dictionaryFlags >> 2) & 3;
                dictionary.huffmanDWSelector = (dictionaryFlags >> 4) & 3;
                dictionary.bitmapSizeSelector = (dictionaryFlags >> 6) & 1;
                dictionary.aggregationInstancesSelector =
                  (dictionaryFlags >> 7) & 1;
                dictionary.bitmapCodingContextUsed = !!(dictionaryFlags & 256);
                dictionary.bitmapCodingContextRetained = !!(
                  dictionaryFlags & 512
                );
                dictionary.template = (dictionaryFlags >> 10) & 3;
                dictionary.refinementTemplate = (dictionaryFlags >> 12) & 1;
                position += 2;

                if (!dictionary.huffman) {
                  atLength = dictionary.template === 0 ? 4 : 1;
                  at = [];

                  for (i = 0; i < atLength; i++) {
                    at.push({
                      x: (0, _util.readInt8)(data, position),
                      y: (0, _util.readInt8)(data, position + 1)
                    });
                    position += 2;
                  }

                  dictionary.at = at;
                }

                if (dictionary.refinement && !dictionary.refinementTemplate) {
                  at = [];

                  for (i = 0; i < 2; i++) {
                    at.push({
                      x: (0, _util.readInt8)(data, position),
                      y: (0, _util.readInt8)(data, position + 1)
                    });
                    position += 2;
                  }

                  dictionary.refinementAt = at;
                }

                dictionary.numberOfExportedSymbols = (0, _util.readUint32)(
                  data,
                  position
                );
                position += 4;
                dictionary.numberOfNewSymbols = (0, _util.readUint32)(
                  data,
                  position
                );
                position += 4;
                args = [
                  dictionary,
                  header.number,
                  header.referredTo,
                  data,
                  position,
                  end
                ];
                break;

              case 6:
              case 7:
                var textRegion = {};
                textRegion.info = readRegionSegmentInformation(data, position);
                position += RegionSegmentInformationFieldLength;
                var textRegionSegmentFlags = (0, _util.readUint16)(
                  data,
                  position
                );
                position += 2;
                textRegion.huffman = !!(textRegionSegmentFlags & 1);
                textRegion.refinement = !!(textRegionSegmentFlags & 2);
                textRegion.logStripSize = (textRegionSegmentFlags >> 2) & 3;
                textRegion.stripSize = 1 << textRegion.logStripSize;
                textRegion.referenceCorner = (textRegionSegmentFlags >> 4) & 3;
                textRegion.transposed = !!(textRegionSegmentFlags & 64);
                textRegion.combinationOperator =
                  (textRegionSegmentFlags >> 7) & 3;
                textRegion.defaultPixelValue =
                  (textRegionSegmentFlags >> 9) & 1;
                textRegion.dsOffset = (textRegionSegmentFlags << 17) >> 27;
                textRegion.refinementTemplate =
                  (textRegionSegmentFlags >> 15) & 1;

                if (textRegion.huffman) {
                  var textRegionHuffmanFlags = (0, _util.readUint16)(
                    data,
                    position
                  );
                  position += 2;
                  textRegion.huffmanFS = textRegionHuffmanFlags & 3;
                  textRegion.huffmanDS = (textRegionHuffmanFlags >> 2) & 3;
                  textRegion.huffmanDT = (textRegionHuffmanFlags >> 4) & 3;
                  textRegion.huffmanRefinementDW =
                    (textRegionHuffmanFlags >> 6) & 3;
                  textRegion.huffmanRefinementDH =
                    (textRegionHuffmanFlags >> 8) & 3;
                  textRegion.huffmanRefinementDX =
                    (textRegionHuffmanFlags >> 10) & 3;
                  textRegion.huffmanRefinementDY =
                    (textRegionHuffmanFlags >> 12) & 3;
                  textRegion.huffmanRefinementSizeSelector = !!(
                    textRegionHuffmanFlags & 0x4000
                  );
                }

                if (textRegion.refinement && !textRegion.refinementTemplate) {
                  at = [];

                  for (i = 0; i < 2; i++) {
                    at.push({
                      x: (0, _util.readInt8)(data, position),
                      y: (0, _util.readInt8)(data, position + 1)
                    });
                    position += 2;
                  }

                  textRegion.refinementAt = at;
                }

                textRegion.numberOfSymbolInstances = (0, _util.readUint32)(
                  data,
                  position
                );
                position += 4;
                args = [textRegion, header.referredTo, data, position, end];
                break;

              case 16:
                var patternDictionary = {};
                var patternDictionaryFlags = data[position++];
                patternDictionary.mmr = !!(patternDictionaryFlags & 1);
                patternDictionary.template = (patternDictionaryFlags >> 1) & 3;
                patternDictionary.patternWidth = data[position++];
                patternDictionary.patternHeight = data[position++];
                patternDictionary.maxPatternIndex = (0, _util.readUint32)(
                  data,
                  position
                );
                position += 4;
                args = [patternDictionary, header.number, data, position, end];
                break;

              case 22:
              case 23:
                var halftoneRegion = {};
                halftoneRegion.info = readRegionSegmentInformation(
                  data,
                  position
                );
                position += RegionSegmentInformationFieldLength;
                var halftoneRegionFlags = data[position++];
                halftoneRegion.mmr = !!(halftoneRegionFlags & 1);
                halftoneRegion.template = (halftoneRegionFlags >> 1) & 3;
                halftoneRegion.enableSkip = !!(halftoneRegionFlags & 8);
                halftoneRegion.combinationOperator =
                  (halftoneRegionFlags >> 4) & 7;
                halftoneRegion.defaultPixelValue =
                  (halftoneRegionFlags >> 7) & 1;
                halftoneRegion.gridWidth = (0, _util.readUint32)(
                  data,
                  position
                );
                position += 4;
                halftoneRegion.gridHeight = (0, _util.readUint32)(
                  data,
                  position
                );
                position += 4;
                halftoneRegion.gridOffsetX =
                  (0, _util.readUint32)(data, position) & 0xffffffff;
                position += 4;
                halftoneRegion.gridOffsetY =
                  (0, _util.readUint32)(data, position) & 0xffffffff;
                position += 4;
                halftoneRegion.gridVectorX = (0, _util.readUint16)(
                  data,
                  position
                );
                position += 2;
                halftoneRegion.gridVectorY = (0, _util.readUint16)(
                  data,
                  position
                );
                position += 2;
                args = [halftoneRegion, header.referredTo, data, position, end];
                break;

              case 38:
              case 39:
                var genericRegion = {};
                genericRegion.info = readRegionSegmentInformation(
                  data,
                  position
                );
                position += RegionSegmentInformationFieldLength;
                var genericRegionSegmentFlags = data[position++];
                genericRegion.mmr = !!(genericRegionSegmentFlags & 1);
                genericRegion.template = (genericRegionSegmentFlags >> 1) & 3;
                genericRegion.prediction = !!(genericRegionSegmentFlags & 8);

                if (!genericRegion.mmr) {
                  atLength = genericRegion.template === 0 ? 4 : 1;
                  at = [];

                  for (i = 0; i < atLength; i++) {
                    at.push({
                      x: (0, _util.readInt8)(data, position),
                      y: (0, _util.readInt8)(data, position + 1)
                    });
                    position += 2;
                  }

                  genericRegion.at = at;
                }

                args = [genericRegion, data, position, end];
                break;

              case 48:
                var pageInfo = {
                  width: (0, _util.readUint32)(data, position),
                  height: (0, _util.readUint32)(data, position + 4),
                  resolutionX: (0, _util.readUint32)(data, position + 8),
                  resolutionY: (0, _util.readUint32)(data, position + 12)
                };

                if (pageInfo.height === 0xffffffff) {
                  delete pageInfo.height;
                }

                var pageSegmentFlags = data[position + 16];
                (0, _util.readUint16)(data, position + 17);
                pageInfo.lossless = !!(pageSegmentFlags & 1);
                pageInfo.refinement = !!(pageSegmentFlags & 2);
                pageInfo.defaultPixelValue = (pageSegmentFlags >> 2) & 1;
                pageInfo.combinationOperator = (pageSegmentFlags >> 3) & 3;
                pageInfo.requiresBuffer = !!(pageSegmentFlags & 32);
                pageInfo.combinationOperatorOverride = !!(
                  pageSegmentFlags & 64
                );
                args = [pageInfo];
                break;

              case 49:
                break;

              case 50:
                break;

              case 51:
                break;

              case 53:
                args = [header.number, data, position, end];
                break;

              case 62:
                break;

              default:
                throw new Jbig2Error(
                  "segment type "
                    .concat(header.typeName, "(")
                    .concat(header.type, ")") + " is not implemented"
                );
            }

            var callbackName = "on" + header.typeName;

            if (callbackName in visitor) {
              visitor[callbackName].apply(visitor, args);
            }
          }
