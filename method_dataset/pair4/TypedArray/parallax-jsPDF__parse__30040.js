function __method_wrapper__() {
            parse: function parse(data) {
              var _ref2 =
                  arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : {},
                _ref2$dnlScanLines = _ref2.dnlScanLines,
                dnlScanLines =
                  _ref2$dnlScanLines === void 0 ? null : _ref2$dnlScanLines;

              function readUint16() {
                var value = (data[offset] << 8) | data[offset + 1];
                offset += 2;
                return value;
              }

              function readDataBlock() {
                var length = readUint16();
                var endOffset = offset + length - 2;
                var fileMarker = findNextFileMarker(data, endOffset, offset);

                if (fileMarker && fileMarker.invalid) {
                  (0, _util.warn)(
                    "readDataBlock - incorrect length, current marker is: " +
                      fileMarker.invalid
                  );
                  endOffset = fileMarker.offset;
                }

                var array = data.subarray(offset, endOffset);
                offset += array.length;
                return array;
              }

              function prepareComponents(frame) {
                var mcusPerLine = Math.ceil(
                  frame.samplesPerLine / 8 / frame.maxH
                );
                var mcusPerColumn = Math.ceil(frame.scanLines / 8 / frame.maxV);

                for (var i = 0; i < frame.components.length; i++) {
                  component = frame.components[i];
                  var blocksPerLine = Math.ceil(
                    (Math.ceil(frame.samplesPerLine / 8) * component.h) /
                      frame.maxH
                  );
                  var blocksPerColumn = Math.ceil(
                    (Math.ceil(frame.scanLines / 8) * component.v) / frame.maxV
                  );
                  var blocksPerLineForMcu = mcusPerLine * component.h;
                  var blocksPerColumnForMcu = mcusPerColumn * component.v;
                  var blocksBufferSize =
                    64 * blocksPerColumnForMcu * (blocksPerLineForMcu + 1);
                  component.blockData = new Int16Array(blocksBufferSize);
                  component.blocksPerLine = blocksPerLine;
                  component.blocksPerColumn = blocksPerColumn;
                }

                frame.mcusPerLine = mcusPerLine;
                frame.mcusPerColumn = mcusPerColumn;
              }

              var offset = 0;
              var jfif = null;
              var adobe = null;
              var frame, resetInterval;
              var numSOSMarkers = 0;
              var quantizationTables = [];
              var huffmanTablesAC = [],
                huffmanTablesDC = [];
              var fileMarker = readUint16();

              if (fileMarker !== 0xffd8) {
                throw new JpegError("SOI not found");
              }

              fileMarker = readUint16();

              markerLoop: while (fileMarker !== 0xffd9) {
                var i, j, l;

                switch (fileMarker) {
                  case 0xffe0:
                  case 0xffe1:
                  case 0xffe2:
                  case 0xffe3:
                  case 0xffe4:
                  case 0xffe5:
                  case 0xffe6:
                  case 0xffe7:
                  case 0xffe8:
                  case 0xffe9:
                  case 0xffea:
                  case 0xffeb:
                  case 0xffec:
                  case 0xffed:
                  case 0xffee:
                  case 0xffef:
                  case 0xfffe:
                    var appData = readDataBlock();

                    if (fileMarker === 0xffe0) {
                      if (
                        appData[0] === 0x4a &&
                        appData[1] === 0x46 &&
                        appData[2] === 0x49 &&
                        appData[3] === 0x46 &&
                        appData[4] === 0
                      ) {
                        jfif = {
                          version: {
                            major: appData[5],
                            minor: appData[6]
                          },
                          densityUnits: appData[7],
                          xDensity: (appData[8] << 8) | appData[9],
                          yDensity: (appData[10] << 8) | appData[11],
                          thumbWidth: appData[12],
                          thumbHeight: appData[13],
                          thumbData: appData.subarray(
                            14,
                            14 + 3 * appData[12] * appData[13]
                          )
                        };
                      }
                    }

                    if (fileMarker === 0xffee) {
                      if (
                        appData[0] === 0x41 &&
                        appData[1] === 0x64 &&
                        appData[2] === 0x6f &&
                        appData[3] === 0x62 &&
                        appData[4] === 0x65
                      ) {
                        adobe = {
                          version: (appData[5] << 8) | appData[6],
                          flags0: (appData[7] << 8) | appData[8],
                          flags1: (appData[9] << 8) | appData[10],
                          transformCode: appData[11]
                        };
                      }
                    }

                    break;

                  case 0xffdb:
                    var quantizationTablesLength = readUint16();
                    var quantizationTablesEnd =
                      quantizationTablesLength + offset - 2;
                    var z;

                    while (offset < quantizationTablesEnd) {
                      var quantizationTableSpec = data[offset++];
                      var tableData = new Uint16Array(64);

                      if (quantizationTableSpec >> 4 === 0) {
                        for (j = 0; j < 64; j++) {
                          z = dctZigZag[j];
                          tableData[z] = data[offset++];
                        }
                      } else if (quantizationTableSpec >> 4 === 1) {
                        for (j = 0; j < 64; j++) {
                          z = dctZigZag[j];
                          tableData[z] = readUint16();
                        }
                      } else {
                        throw new JpegError("DQT - invalid table spec");
                      }

                      quantizationTables[
                        quantizationTableSpec & 15
                      ] = tableData;
                    }

                    break;

                  case 0xffc0:
                  case 0xffc1:
                  case 0xffc2:
                    if (frame) {
                      throw new JpegError("Only single frame JPEGs supported");
                    }

                    readUint16();
                    frame = {};
                    frame.extended = fileMarker === 0xffc1;
                    frame.progressive = fileMarker === 0xffc2;
                    frame.precision = data[offset++];
                    var sofScanLines = readUint16();
                    frame.scanLines = dnlScanLines || sofScanLines;
                    frame.samplesPerLine = readUint16();
                    frame.components = [];
                    frame.componentIds = {};
                    var componentsCount = data[offset++],
                      componentId;
                    var maxH = 0,
                      maxV = 0;

                    for (i = 0; i < componentsCount; i++) {
                      componentId = data[offset];
                      var h = data[offset + 1] >> 4;
                      var v = data[offset + 1] & 15;

                      if (maxH < h) {
                        maxH = h;
                      }

                      if (maxV < v) {
                        maxV = v;
                      }

                      var qId = data[offset + 2];
                      l = frame.components.push({
                        h: h,
                        v: v,
                        quantizationId: qId,
                        quantizationTable: null
                      });
                      frame.componentIds[componentId] = l - 1;
                      offset += 3;
                    }

                    frame.maxH = maxH;
                    frame.maxV = maxV;
                    prepareComponents(frame);
                    break;

                  case 0xffc4:
                    var huffmanLength = readUint16();

                    for (i = 2; i < huffmanLength; ) {
                      var huffmanTableSpec = data[offset++];
                      var codeLengths = new Uint8Array(16);
                      var codeLengthSum = 0;

                      for (j = 0; j < 16; j++, offset++) {
                        codeLengthSum += codeLengths[j] = data[offset];
                      }

                      var huffmanValues = new Uint8Array(codeLengthSum);

                      for (j = 0; j < codeLengthSum; j++, offset++) {
                        huffmanValues[j] = data[offset];
                      }

                      i += 17 + codeLengthSum;
                      (huffmanTableSpec >> 4 === 0
                        ? huffmanTablesDC
                        : huffmanTablesAC)[
                        huffmanTableSpec & 15
                      ] = buildHuffmanTable(codeLengths, huffmanValues);
                    }

                    break;

                  case 0xffdd:
                    readUint16();
                    resetInterval = readUint16();
                    break;

                  case 0xffda:
                    var parseDNLMarker = ++numSOSMarkers === 1 && !dnlScanLines;
                    readUint16();
                    var selectorsCount = data[offset++];
                    var components = [],
                      component;

                    for (i = 0; i < selectorsCount; i++) {
                      var componentIndex = frame.componentIds[data[offset++]];
                      component = frame.components[componentIndex];
                      var tableSpec = data[offset++];
                      component.huffmanTableDC =
                        huffmanTablesDC[tableSpec >> 4];
                      component.huffmanTableAC =
                        huffmanTablesAC[tableSpec & 15];
                      components.push(component);
                    }

                    var spectralStart = data[offset++];
                    var spectralEnd = data[offset++];
                    var successiveApproximation = data[offset++];

                    try {
                      var processed = decodeScan(
                        data,
                        offset,
                        frame,
                        components,
                        resetInterval,
                        spectralStart,
                        spectralEnd,
                        successiveApproximation >> 4,
                        successiveApproximation & 15,
                        parseDNLMarker
                      );
                      offset += processed;
                    } catch (ex) {
                      if (ex instanceof DNLMarkerError) {
                        (0, _util.warn)(
                          "".concat(
                            ex.message,
                            " -- attempting to re-parse the JPEG image."
                          )
                        );
                        return this.parse(data, {
                          dnlScanLines: ex.scanLines
                        });
                      } else if (ex instanceof EOIMarkerError) {
                        (0, _util.warn)(
                          "".concat(
                            ex.message,
                            " -- ignoring the rest of the image data."
                          )
                        );
                        break markerLoop;
                      }

                      throw ex;
                    }

                    break;

                  case 0xffdc:
                    offset += 4;
                    break;

                  case 0xffff:
                    if (data[offset] !== 0xff) {
                      offset--;
                    }

                    break;

                  default:
                    if (
                      data[offset - 3] === 0xff &&
                      data[offset - 2] >= 0xc0 &&
                      data[offset - 2] <= 0xfe
                    ) {
                      offset -= 3;
                      break;
                    }

                    var nextFileMarker = findNextFileMarker(data, offset - 2);

                    if (nextFileMarker && nextFileMarker.invalid) {
                      (0, _util.warn)(
                        "JpegImage.parse - unexpected data, current marker is: " +
                          nextFileMarker.invalid
                      );
                      offset = nextFileMarker.offset;
                      break;
                    }

                    throw new JpegError(
                      "unknown marker " + fileMarker.toString(16)
                    );
                }

                fileMarker = readUint16();
              }

              this.width = frame.samplesPerLine;
              this.height = frame.scanLines;
              this.jfif = jfif;
              this.adobe = adobe;
              this.components = [];

              for (i = 0; i < frame.components.length; i++) {
                component = frame.components[i];
                var quantizationTable =
                  quantizationTables[component.quantizationId];

                if (quantizationTable) {
                  component.quantizationTable = quantizationTable;
                }

                this.components.push({
                  output: buildComponentData(frame, component),
                  scaleX: component.h / frame.maxH,
                  scaleY: component.v / frame.maxV,
                  blocksPerLine: component.blocksPerLine,
                  blocksPerColumn: component.blocksPerColumn
                });
              }

              this.numComponents = this.components.length;
            },

}
