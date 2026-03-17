function __method_wrapper__() {
            checkAndRepair: function Font_checkAndRepair(
              name,
              font,
              properties
            ) {
              var VALID_TABLES = [
                "OS/2",
                "cmap",
                "head",
                "hhea",
                "hmtx",
                "maxp",
                "name",
                "post",
                "loca",
                "glyf",
                "fpgm",
                "prep",
                "cvt ",
                "CFF "
              ];

              function readTables(file, numTables) {
                var tables = Object.create(null);
                tables["OS/2"] = null;
                tables["cmap"] = null;
                tables["head"] = null;
                tables["hhea"] = null;
                tables["hmtx"] = null;
                tables["maxp"] = null;
                tables["name"] = null;
                tables["post"] = null;

                for (var i = 0; i < numTables; i++) {
                  var table = readTableEntry(font);

                  if (!VALID_TABLES.includes(table.tag)) {
                    continue;
                  }

                  if (table.length === 0) {
                    continue;
                  }

                  tables[table.tag] = table;
                }

                return tables;
              }

              function readTableEntry(file) {
                var tag = (0, _util.bytesToString)(file.getBytes(4));
                var checksum = file.getInt32() >>> 0;
                var offset = file.getInt32() >>> 0;
                var length = file.getInt32() >>> 0;
                var previousPosition = file.pos;
                file.pos = file.start ? file.start : 0;
                file.skip(offset);
                var data = file.getBytes(length);
                file.pos = previousPosition;

                if (tag === "head") {
                  data[8] = data[9] = data[10] = data[11] = 0;
                  data[17] |= 0x20;
                }

                return {
                  tag: tag,
                  checksum: checksum,
                  length: length,
                  offset: offset,
                  data: data
                };
              }

              function readOpenTypeHeader(ttf) {
                return {
                  version: (0, _util.bytesToString)(ttf.getBytes(4)),
                  numTables: ttf.getUint16(),
                  searchRange: ttf.getUint16(),
                  entrySelector: ttf.getUint16(),
                  rangeShift: ttf.getUint16()
                };
              }

              function readTrueTypeCollectionHeader(ttc) {
                var ttcTag = (0, _util.bytesToString)(ttc.getBytes(4));
                (0, _util.assert)(
                  ttcTag === "ttcf",
                  "Must be a TrueType Collection font."
                );
                var majorVersion = ttc.getUint16();
                var minorVersion = ttc.getUint16();
                var numFonts = ttc.getInt32() >>> 0;
                var offsetTable = [];

                for (var i = 0; i < numFonts; i++) {
                  offsetTable.push(ttc.getInt32() >>> 0);
                }

                var header = {
                  ttcTag: ttcTag,
                  majorVersion: majorVersion,
                  minorVersion: minorVersion,
                  numFonts: numFonts,
                  offsetTable: offsetTable
                };

                switch (majorVersion) {
                  case 1:
                    return header;

                  case 2:
                    header.dsigTag = ttc.getInt32() >>> 0;
                    header.dsigLength = ttc.getInt32() >>> 0;
                    header.dsigOffset = ttc.getInt32() >>> 0;
                    return header;
                }

                throw new _util.FormatError(
                  "Invalid TrueType Collection majorVersion: ".concat(
                    majorVersion,
                    "."
                  )
                );
              }

              function readTrueTypeCollectionData(ttc, fontName) {
                var _readTrueTypeCollecti = readTrueTypeCollectionHeader(ttc),
                  numFonts = _readTrueTypeCollecti.numFonts,
                  offsetTable = _readTrueTypeCollecti.offsetTable;

                for (var i = 0; i < numFonts; i++) {
                  ttc.pos = (ttc.start || 0) + offsetTable[i];
                  var potentialHeader = readOpenTypeHeader(ttc);
                  var potentialTables = readTables(
                    ttc,
                    potentialHeader.numTables
                  );

                  if (!potentialTables["name"]) {
                    throw new _util.FormatError(
                      'TrueType Collection font must contain a "name" table.'
                    );
                  }

                  var nameTable = readNameTable(potentialTables["name"]);

                  for (var j = 0, jj = nameTable.length; j < jj; j++) {
                    for (var k = 0, kk = nameTable[j].length; k < kk; k++) {
                      var nameEntry = nameTable[j][k];

                      if (
                        nameEntry &&
                        nameEntry.replace(/\s/g, "") === fontName
                      ) {
                        return {
                          header: potentialHeader,
                          tables: potentialTables
                        };
                      }
                    }
                  }
                }

                throw new _util.FormatError(
                  'TrueType Collection does not contain "'.concat(
                    fontName,
                    '" font.'
                  )
                );
              }

              function readCmapTable(cmap, font, isSymbolicFont, hasEncoding) {
                if (!cmap) {
                  (0, _util.warn)("No cmap table available.");
                  return {
                    platformId: -1,
                    encodingId: -1,
                    mappings: [],
                    hasShortCmap: false
                  };
                }

                var segment;
                var start = (font.start ? font.start : 0) + cmap.offset;
                font.pos = start;
                font.getUint16();
                var numTables = font.getUint16();
                var potentialTable;
                var canBreak = false;

                for (var i = 0; i < numTables; i++) {
                  var platformId = font.getUint16();
                  var encodingId = font.getUint16();
                  var offset = font.getInt32() >>> 0;
                  var useTable = false;

                  if (
                    potentialTable &&
                    potentialTable.platformId === platformId &&
                    potentialTable.encodingId === encodingId
                  ) {
                    continue;
                  }

                  if (platformId === 0 && encodingId === 0) {
                    useTable = true;
                  } else if (platformId === 1 && encodingId === 0) {
                    useTable = true;
                  } else if (
                    platformId === 3 &&
                    encodingId === 1 &&
                    (hasEncoding || !potentialTable)
                  ) {
                    useTable = true;

                    if (!isSymbolicFont) {
                      canBreak = true;
                    }
                  } else if (
                    isSymbolicFont &&
                    platformId === 3 &&
                    encodingId === 0
                  ) {
                    useTable = true;
                    canBreak = true;
                  }

                  if (useTable) {
                    potentialTable = {
                      platformId: platformId,
                      encodingId: encodingId,
                      offset: offset
                    };
                  }

                  if (canBreak) {
                    break;
                  }
                }

                if (potentialTable) {
                  font.pos = start + potentialTable.offset;
                }

                if (!potentialTable || font.peekByte() === -1) {
                  (0, _util.warn)("Could not find a preferred cmap table.");
                  return {
                    platformId: -1,
                    encodingId: -1,
                    mappings: [],
                    hasShortCmap: false
                  };
                }

                var format = font.getUint16();
                font.getUint16();
                font.getUint16();
                var hasShortCmap = false;
                var mappings = [];
                var j, glyphId;

                if (format === 0) {
                  for (j = 0; j < 256; j++) {
                    var index = font.getByte();

                    if (!index) {
                      continue;
                    }

                    mappings.push({
                      charCode: j,
                      glyphId: index
                    });
                  }

                  hasShortCmap = true;
                } else if (format === 4) {
                  var segCount = font.getUint16() >> 1;
                  font.getBytes(6);
                  var segIndex,
                    segments = [];

                  for (segIndex = 0; segIndex < segCount; segIndex++) {
                    segments.push({
                      end: font.getUint16()
                    });
                  }

                  font.getUint16();

                  for (segIndex = 0; segIndex < segCount; segIndex++) {
                    segments[segIndex].start = font.getUint16();
                  }

                  for (segIndex = 0; segIndex < segCount; segIndex++) {
                    segments[segIndex].delta = font.getUint16();
                  }

                  var offsetsCount = 0;

                  for (segIndex = 0; segIndex < segCount; segIndex++) {
                    segment = segments[segIndex];
                    var rangeOffset = font.getUint16();

                    if (!rangeOffset) {
                      segment.offsetIndex = -1;
                      continue;
                    }

                    var offsetIndex =
                      (rangeOffset >> 1) - (segCount - segIndex);
                    segment.offsetIndex = offsetIndex;
                    offsetsCount = Math.max(
                      offsetsCount,
                      offsetIndex + segment.end - segment.start + 1
                    );
                  }

                  var offsets = [];

                  for (j = 0; j < offsetsCount; j++) {
                    offsets.push(font.getUint16());
                  }

                  for (segIndex = 0; segIndex < segCount; segIndex++) {
                    segment = segments[segIndex];
                    start = segment.start;
                    var end = segment.end;
                    var delta = segment.delta;
                    offsetIndex = segment.offsetIndex;

                    for (j = start; j <= end; j++) {
                      if (j === 0xffff) {
                        continue;
                      }

                      glyphId =
                        offsetIndex < 0 ? j : offsets[offsetIndex + j - start];
                      glyphId = (glyphId + delta) & 0xffff;
                      mappings.push({
                        charCode: j,
                        glyphId: glyphId
                      });
                    }
                  }
                } else if (format === 6) {
                  var firstCode = font.getUint16();
                  var entryCount = font.getUint16();

                  for (j = 0; j < entryCount; j++) {
                    glyphId = font.getUint16();
                    var charCode = firstCode + j;
                    mappings.push({
                      charCode: charCode,
                      glyphId: glyphId
                    });
                  }
                } else {
                  (0, _util.warn)(
                    "cmap table has unsupported format: " + format
                  );
                  return {
                    platformId: -1,
                    encodingId: -1,
                    mappings: [],
                    hasShortCmap: false
                  };
                }

                mappings.sort(function(a, b) {
                  return a.charCode - b.charCode;
                });

                for (i = 1; i < mappings.length; i++) {
                  if (mappings[i - 1].charCode === mappings[i].charCode) {
                    mappings.splice(i, 1);
                    i--;
                  }
                }

                return {
                  platformId: potentialTable.platformId,
                  encodingId: potentialTable.encodingId,
                  mappings: mappings,
                  hasShortCmap: hasShortCmap
                };
              }

              function sanitizeMetrics(font, header, metrics, numGlyphs) {
                if (!header) {
                  if (metrics) {
                    metrics.data = null;
                  }

                  return;
                }

                font.pos = (font.start ? font.start : 0) + header.offset;
                font.pos += 4;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 8;
                font.pos += 2;
                var numOfMetrics = font.getUint16();

                if (numOfMetrics > numGlyphs) {
                  (0, _util.info)(
                    "The numOfMetrics (" +
                      numOfMetrics +
                      ") should not be " +
                      "greater than the numGlyphs (" +
                      numGlyphs +
                      ")"
                  );
                  numOfMetrics = numGlyphs;
                  header.data[34] = (numOfMetrics & 0xff00) >> 8;
                  header.data[35] = numOfMetrics & 0x00ff;
                }

                var numOfSidebearings = numGlyphs - numOfMetrics;
                var numMissing =
                  numOfSidebearings -
                  ((metrics.length - numOfMetrics * 4) >> 1);

                if (numMissing > 0) {
                  var entries = new Uint8Array(metrics.length + numMissing * 2);
                  entries.set(metrics.data);
                  metrics.data = entries;
                }
              }

              function sanitizeGlyph(
                source,
                sourceStart,
                sourceEnd,
                dest,
                destStart,
                hintsValid
              ) {
                var glyphProfile = {
                  length: 0,
                  sizeOfInstructions: 0
                };

                if (sourceEnd - sourceStart <= 12) {
                  return glyphProfile;
                }

                var glyf = source.subarray(sourceStart, sourceEnd);
                var contoursCount = signedInt16(glyf[0], glyf[1]);

                if (contoursCount < 0) {
                  contoursCount = -1;
                  writeSignedInt16(glyf, 0, contoursCount);
                  dest.set(glyf, destStart);
                  glyphProfile.length = glyf.length;
                  return glyphProfile;
                }

                var i,
                  j = 10,
                  flagsCount = 0;

                for (i = 0; i < contoursCount; i++) {
                  var endPoint = (glyf[j] << 8) | glyf[j + 1];
                  flagsCount = endPoint + 1;
                  j += 2;
                }

                var instructionsStart = j;
                var instructionsLength = (glyf[j] << 8) | glyf[j + 1];
                glyphProfile.sizeOfInstructions = instructionsLength;
                j += 2 + instructionsLength;
                var instructionsEnd = j;
                var coordinatesLength = 0;

                for (i = 0; i < flagsCount; i++) {
                  var flag = glyf[j++];

                  if (flag & 0xc0) {
                    glyf[j - 1] = flag & 0x3f;
                  }

                  var xyLength =
                    (flag & 2 ? 1 : flag & 16 ? 0 : 2) +
                    (flag & 4 ? 1 : flag & 32 ? 0 : 2);
                  coordinatesLength += xyLength;

                  if (flag & 8) {
                    var repeat = glyf[j++];
                    i += repeat;
                    coordinatesLength += repeat * xyLength;
                  }
                }

                if (coordinatesLength === 0) {
                  return glyphProfile;
                }

                var glyphDataLength = j + coordinatesLength;

                if (glyphDataLength > glyf.length) {
                  return glyphProfile;
                }

                if (!hintsValid && instructionsLength > 0) {
                  dest.set(glyf.subarray(0, instructionsStart), destStart);
                  dest.set([0, 0], destStart + instructionsStart);
                  dest.set(
                    glyf.subarray(instructionsEnd, glyphDataLength),
                    destStart + instructionsStart + 2
                  );
                  glyphDataLength -= instructionsLength;

                  if (glyf.length - glyphDataLength > 3) {
                    glyphDataLength = (glyphDataLength + 3) & ~3;
                  }

                  glyphProfile.length = glyphDataLength;
                  return glyphProfile;
                }

                if (glyf.length - glyphDataLength > 3) {
                  glyphDataLength = (glyphDataLength + 3) & ~3;
                  dest.set(glyf.subarray(0, glyphDataLength), destStart);
                  glyphProfile.length = glyphDataLength;
                  return glyphProfile;
                }

                dest.set(glyf, destStart);
                glyphProfile.length = glyf.length;
                return glyphProfile;
              }

              function sanitizeHead(head, numGlyphs, locaLength) {
                var data = head.data;
                var version = int32(data[0], data[1], data[2], data[3]);

                if (version >> 16 !== 1) {
                  (0, _util.info)(
                    "Attempting to fix invalid version in head table: " +
                      version
                  );
                  data[0] = 0;
                  data[1] = 1;
                  data[2] = 0;
                  data[3] = 0;
                }

                var indexToLocFormat = int16(data[50], data[51]);

                if (indexToLocFormat < 0 || indexToLocFormat > 1) {
                  (0, _util.info)(
                    "Attempting to fix invalid indexToLocFormat in head table: " +
                      indexToLocFormat
                  );
                  var numGlyphsPlusOne = numGlyphs + 1;

                  if (locaLength === numGlyphsPlusOne << 1) {
                    data[50] = 0;
                    data[51] = 0;
                  } else if (locaLength === numGlyphsPlusOne << 2) {
                    data[50] = 0;
                    data[51] = 1;
                  } else {
                    throw new _util.FormatError(
                      "Could not fix indexToLocFormat: " + indexToLocFormat
                    );
                  }
                }
              }

              function sanitizeGlyphLocations(
                loca,
                glyf,
                numGlyphs,
                isGlyphLocationsLong,
                hintsValid,
                dupFirstEntry,
                maxSizeOfInstructions
              ) {
                var itemSize, itemDecode, itemEncode;

                if (isGlyphLocationsLong) {
                  itemSize = 4;

                  itemDecode = function fontItemDecodeLong(data, offset) {
                    return (
                      (data[offset] << 24) |
                      (data[offset + 1] << 16) |
                      (data[offset + 2] << 8) |
                      data[offset + 3]
                    );
                  };

                  itemEncode = function fontItemEncodeLong(
                    data,
                    offset,
                    value
                  ) {
                    data[offset] = (value >>> 24) & 0xff;
                    data[offset + 1] = (value >> 16) & 0xff;
                    data[offset + 2] = (value >> 8) & 0xff;
                    data[offset + 3] = value & 0xff;
                  };
                } else {
                  itemSize = 2;

                  itemDecode = function fontItemDecode(data, offset) {
                    return (data[offset] << 9) | (data[offset + 1] << 1);
                  };

                  itemEncode = function fontItemEncode(data, offset, value) {
                    data[offset] = (value >> 9) & 0xff;
                    data[offset + 1] = (value >> 1) & 0xff;
                  };
                }

                var numGlyphsOut = dupFirstEntry ? numGlyphs + 1 : numGlyphs;
                var locaData = loca.data;
                var locaDataSize = itemSize * (1 + numGlyphsOut);
                locaData = new Uint8Array(locaDataSize);
                locaData.set(loca.data.subarray(0, locaDataSize));
                loca.data = locaData;
                var oldGlyfData = glyf.data;
                var oldGlyfDataLength = oldGlyfData.length;
                var newGlyfData = new Uint8Array(oldGlyfDataLength);
                var startOffset = itemDecode(locaData, 0);
                var writeOffset = 0;
                var missingGlyphs = Object.create(null);
                itemEncode(locaData, 0, writeOffset);
                var i, j;

                for (i = 0, j = itemSize; i < numGlyphs; i++, j += itemSize) {
                  var endOffset = itemDecode(locaData, j);

                  if (endOffset === 0) {
                    endOffset = startOffset;
                  }

                  if (
                    endOffset > oldGlyfDataLength &&
                    ((oldGlyfDataLength + 3) & ~3) === endOffset
                  ) {
                    endOffset = oldGlyfDataLength;
                  }

                  if (endOffset > oldGlyfDataLength) {
                    startOffset = endOffset;
                  }

                  var glyphProfile = sanitizeGlyph(
                    oldGlyfData,
                    startOffset,
                    endOffset,
                    newGlyfData,
                    writeOffset,
                    hintsValid
                  );
                  var newLength = glyphProfile.length;

                  if (newLength === 0) {
                    missingGlyphs[i] = true;
                  }

                  if (glyphProfile.sizeOfInstructions > maxSizeOfInstructions) {
                    maxSizeOfInstructions = glyphProfile.sizeOfInstructions;
                  }

                  writeOffset += newLength;
                  itemEncode(locaData, j, writeOffset);
                  startOffset = endOffset;
                }

                if (writeOffset === 0) {
                  var simpleGlyph = new Uint8Array([
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    49,
                    0
                  ]);

                  for (
                    i = 0, j = itemSize;
                    i < numGlyphsOut;
                    i++, j += itemSize
                  ) {
                    itemEncode(locaData, j, simpleGlyph.length);
                  }

                  glyf.data = simpleGlyph;
                } else if (dupFirstEntry) {
                  var firstEntryLength = itemDecode(locaData, itemSize);

                  if (newGlyfData.length > firstEntryLength + writeOffset) {
                    glyf.data = newGlyfData.subarray(
                      0,
                      firstEntryLength + writeOffset
                    );
                  } else {
                    glyf.data = new Uint8Array(firstEntryLength + writeOffset);
                    glyf.data.set(newGlyfData.subarray(0, writeOffset));
                  }

                  glyf.data.set(
                    newGlyfData.subarray(0, firstEntryLength),
                    writeOffset
                  );
                  itemEncode(
                    loca.data,
                    locaData.length - itemSize,
                    writeOffset + firstEntryLength
                  );
                } else {
                  glyf.data = newGlyfData.subarray(0, writeOffset);
                }

                return {
                  missingGlyphs: missingGlyphs,
                  maxSizeOfInstructions: maxSizeOfInstructions
                };
              }

              function readPostScriptTable(post, properties, maxpNumGlyphs) {
                var start = (font.start ? font.start : 0) + post.offset;
                font.pos = start;
                var length = post.length,
                  end = start + length;
                var version = font.getInt32();
                font.getBytes(28);
                var glyphNames;
                var valid = true;
                var i;

                switch (version) {
                  case 0x00010000:
                    glyphNames = MacStandardGlyphOrdering;
                    break;

                  case 0x00020000:
                    var numGlyphs = font.getUint16();

                    if (numGlyphs !== maxpNumGlyphs) {
                      valid = false;
                      break;
                    }

                    var glyphNameIndexes = [];

                    for (i = 0; i < numGlyphs; ++i) {
                      var index = font.getUint16();

                      if (index >= 32768) {
                        valid = false;
                        break;
                      }

                      glyphNameIndexes.push(index);
                    }

                    if (!valid) {
                      break;
                    }

                    var customNames = [];
                    var strBuf = [];

                    while (font.pos < end) {
                      var stringLength = font.getByte();
                      strBuf.length = stringLength;

                      for (i = 0; i < stringLength; ++i) {
                        strBuf[i] = String.fromCharCode(font.getByte());
                      }

                      customNames.push(strBuf.join(""));
                    }

                    glyphNames = [];

                    for (i = 0; i < numGlyphs; ++i) {
                      var j = glyphNameIndexes[i];

                      if (j < 258) {
                        glyphNames.push(MacStandardGlyphOrdering[j]);
                        continue;
                      }

                      glyphNames.push(customNames[j - 258]);
                    }

                    break;

                  case 0x00030000:
                    break;

                  default:
                    (0, _util.warn)(
                      "Unknown/unsupported post table version " + version
                    );
                    valid = false;

                    if (properties.defaultEncoding) {
                      glyphNames = properties.defaultEncoding;
                    }

                    break;
                }

                properties.glyphNames = glyphNames;
                return valid;
              }

              function readNameTable(nameTable) {
                var start = (font.start ? font.start : 0) + nameTable.offset;
                font.pos = start;
                var names = [[], []];
                var length = nameTable.length,
                  end = start + length;
                var format = font.getUint16();
                var FORMAT_0_HEADER_LENGTH = 6;

                if (format !== 0 || length < FORMAT_0_HEADER_LENGTH) {
                  return names;
                }

                var numRecords = font.getUint16();
                var stringsStart = font.getUint16();
                var records = [];
                var NAME_RECORD_LENGTH = 12;
                var i, ii;

                for (
                  i = 0;
                  i < numRecords && font.pos + NAME_RECORD_LENGTH <= end;
                  i++
                ) {
                  var r = {
                    platform: font.getUint16(),
                    encoding: font.getUint16(),
                    language: font.getUint16(),
                    name: font.getUint16(),
                    length: font.getUint16(),
                    offset: font.getUint16()
                  };

                  if (
                    (r.platform === 1 &&
                      r.encoding === 0 &&
                      r.language === 0) ||
                    (r.platform === 3 &&
                      r.encoding === 1 &&
                      r.language === 0x409)
                  ) {
                    records.push(r);
                  }
                }

                for (i = 0, ii = records.length; i < ii; i++) {
                  var record = records[i];

                  if (record.length <= 0) {
                    continue;
                  }

                  var pos = start + stringsStart + record.offset;

                  if (pos + record.length > end) {
                    continue;
                  }

                  font.pos = pos;
                  var nameIndex = record.name;

                  if (record.encoding) {
                    var str = "";

                    for (var j = 0, jj = record.length; j < jj; j += 2) {
                      str += String.fromCharCode(font.getUint16());
                    }

                    names[1][nameIndex] = str;
                  } else {
                    names[0][nameIndex] = (0, _util.bytesToString)(
                      font.getBytes(record.length)
                    );
                  }
                }

                return names;
              }

              var TTOpsStackDeltas = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                -2,
                -2,
                -2,
                -2,
                0,
                0,
                -2,
                -5,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                0,
                0,
                -1,
                0,
                -1,
                -1,
                -1,
                -1,
                1,
                -1,
                -999,
                0,
                1,
                0,
                -1,
                -2,
                0,
                -1,
                -2,
                -1,
                -1,
                0,
                -1,
                -1,
                0,
                0,
                -999,
                -999,
                -1,
                -1,
                -1,
                -1,
                -2,
                -999,
                -2,
                -2,
                -999,
                0,
                -2,
                -2,
                0,
                0,
                -2,
                0,
                -2,
                0,
                0,
                0,
                -2,
                -1,
                -1,
                1,
                1,
                0,
                0,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                0,
                0,
                -1,
                0,
                -1,
                -1,
                0,
                -999,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                -2,
                -999,
                -999,
                -999,
                -999,
                -999,
                -1,
                -1,
                -2,
                -2,
                0,
                0,
                0,
                0,
                -1,
                -1,
                -999,
                -2,
                -2,
                0,
                0,
                -1,
                -2,
                -2,
                0,
                0,
                0,
                -1,
                -1,
                -1,
                -2
              ];

              function sanitizeTTProgram(table, ttContext) {
                var data = table.data;
                var i = 0,
                  j,
                  n,
                  b,
                  funcId,
                  pc,
                  lastEndf = 0,
                  lastDeff = 0;
                var stack = [];
                var callstack = [];
                var functionsCalled = [];
                var tooComplexToFollowFunctions =
                  ttContext.tooComplexToFollowFunctions;
                var inFDEF = false,
                  ifLevel = 0,
                  inELSE = 0;

                for (var ii = data.length; i < ii; ) {
                  var op = data[i++];

                  if (op === 0x40) {
                    n = data[i++];

                    if (inFDEF || inELSE) {
                      i += n;
                    } else {
                      for (j = 0; j < n; j++) {
                        stack.push(data[i++]);
                      }
                    }
                  } else if (op === 0x41) {
                    n = data[i++];

                    if (inFDEF || inELSE) {
                      i += n * 2;
                    } else {
                      for (j = 0; j < n; j++) {
                        b = data[i++];
                        stack.push((b << 8) | data[i++]);
                      }
                    }
                  } else if ((op & 0xf8) === 0xb0) {
                    n = op - 0xb0 + 1;

                    if (inFDEF || inELSE) {
                      i += n;
                    } else {
                      for (j = 0; j < n; j++) {
                        stack.push(data[i++]);
                      }
                    }
                  } else if ((op & 0xf8) === 0xb8) {
                    n = op - 0xb8 + 1;

                    if (inFDEF || inELSE) {
                      i += n * 2;
                    } else {
                      for (j = 0; j < n; j++) {
                        b = data[i++];
                        stack.push((b << 8) | data[i++]);
                      }
                    }
                  } else if (op === 0x2b && !tooComplexToFollowFunctions) {
                    if (!inFDEF && !inELSE) {
                      funcId = stack[stack.length - 1];

                      if (isNaN(funcId)) {
                        (0, _util.info)(
                          "TT: CALL empty stack (or invalid entry)."
                        );
                      } else {
                        ttContext.functionsUsed[funcId] = true;

                        if (funcId in ttContext.functionsStackDeltas) {
                          var newStackLength =
                            stack.length +
                            ttContext.functionsStackDeltas[funcId];

                          if (newStackLength < 0) {
                            (0, _util.warn)(
                              "TT: CALL invalid functions stack delta."
                            );
                            ttContext.hintsValid = false;
                            return;
                          }

                          stack.length = newStackLength;
                        } else if (
                          funcId in ttContext.functionsDefined &&
                          !functionsCalled.includes(funcId)
                        ) {
                          callstack.push({
                            data: data,
                            i: i,
                            stackTop: stack.length - 1
                          });
                          functionsCalled.push(funcId);
                          pc = ttContext.functionsDefined[funcId];

                          if (!pc) {
                            (0, _util.warn)("TT: CALL non-existent function");
                            ttContext.hintsValid = false;
                            return;
                          }

                          data = pc.data;
                          i = pc.i;
                        }
                      }
                    }
                  } else if (op === 0x2c && !tooComplexToFollowFunctions) {
                    if (inFDEF || inELSE) {
                      (0, _util.warn)("TT: nested FDEFs not allowed");
                      tooComplexToFollowFunctions = true;
                    }

                    inFDEF = true;
                    lastDeff = i;
                    funcId = stack.pop();
                    ttContext.functionsDefined[funcId] = {
                      data: data,
                      i: i
                    };
                  } else if (op === 0x2d) {
                    if (inFDEF) {
                      inFDEF = false;
                      lastEndf = i;
                    } else {
                      pc = callstack.pop();

                      if (!pc) {
                        (0, _util.warn)("TT: ENDF bad stack");
                        ttContext.hintsValid = false;
                        return;
                      }

                      funcId = functionsCalled.pop();
                      data = pc.data;
                      i = pc.i;
                      ttContext.functionsStackDeltas[funcId] =
                        stack.length - pc.stackTop;
                    }
                  } else if (op === 0x89) {
                    if (inFDEF || inELSE) {
                      (0, _util.warn)("TT: nested IDEFs not allowed");
                      tooComplexToFollowFunctions = true;
                    }

                    inFDEF = true;
                    lastDeff = i;
                  } else if (op === 0x58) {
                    ++ifLevel;
                  } else if (op === 0x1b) {
                    inELSE = ifLevel;
                  } else if (op === 0x59) {
                    if (inELSE === ifLevel) {
                      inELSE = 0;
                    }

                    --ifLevel;
                  } else if (op === 0x1c) {
                    if (!inFDEF && !inELSE) {
                      var offset = stack[stack.length - 1];

                      if (offset > 0) {
                        i += offset - 1;
                      }
                    }
                  }

                  if (!inFDEF && !inELSE) {
                    var stackDelta =
                      op <= 0x8e
                        ? TTOpsStackDeltas[op]
                        : op >= 0xc0 && op <= 0xdf
                        ? -1
                        : op >= 0xe0
                        ? -2
                        : 0;

                    if (op >= 0x71 && op <= 0x75) {
                      n = stack.pop();

                      if (!isNaN(n)) {
                        stackDelta = -n * 2;
                      }
                    }

                    while (stackDelta < 0 && stack.length > 0) {
                      stack.pop();
                      stackDelta++;
                    }

                    while (stackDelta > 0) {
                      stack.push(NaN);
                      stackDelta--;
                    }
                  }
                }

                ttContext.tooComplexToFollowFunctions = tooComplexToFollowFunctions;
                var content = [data];

                if (i > data.length) {
                  content.push(new Uint8Array(i - data.length));
                }

                if (lastDeff > lastEndf) {
                  (0, _util.warn)("TT: complementing a missing function tail");
                  content.push(new Uint8Array([0x22, 0x2d]));
                }

                foldTTTable(table, content);
              }

              function checkInvalidFunctions(ttContext, maxFunctionDefs) {
                if (ttContext.tooComplexToFollowFunctions) {
                  return;
                }

                if (ttContext.functionsDefined.length > maxFunctionDefs) {
                  (0, _util.warn)("TT: more functions defined than expected");
                  ttContext.hintsValid = false;
                  return;
                }

                for (
                  var j = 0, jj = ttContext.functionsUsed.length;
                  j < jj;
                  j++
                ) {
                  if (j > maxFunctionDefs) {
                    (0, _util.warn)("TT: invalid function id: " + j);
                    ttContext.hintsValid = false;
                    return;
                  }

                  if (
                    ttContext.functionsUsed[j] &&
                    !ttContext.functionsDefined[j]
                  ) {
                    (0, _util.warn)("TT: undefined function: " + j);
                    ttContext.hintsValid = false;
                    return;
                  }
                }
              }

              function foldTTTable(table, content) {
                if (content.length > 1) {
                  var newLength = 0;
                  var j, jj;

                  for (j = 0, jj = content.length; j < jj; j++) {
                    newLength += content[j].length;
                  }

                  newLength = (newLength + 3) & ~3;
                  var result = new Uint8Array(newLength);
                  var pos = 0;

                  for (j = 0, jj = content.length; j < jj; j++) {
                    result.set(content[j], pos);
                    pos += content[j].length;
                  }

                  table.data = result;
                  table.length = newLength;
                }
              }

              function sanitizeTTPrograms(fpgm, prep, cvt, maxFunctionDefs) {
                var ttContext = {
                  functionsDefined: [],
                  functionsUsed: [],
                  functionsStackDeltas: [],
                  tooComplexToFollowFunctions: false,
                  hintsValid: true
                };

                if (fpgm) {
                  sanitizeTTProgram(fpgm, ttContext);
                }

                if (prep) {
                  sanitizeTTProgram(prep, ttContext);
                }

                if (fpgm) {
                  checkInvalidFunctions(ttContext, maxFunctionDefs);
                }

                if (cvt && cvt.length & 1) {
                  var cvtData = new Uint8Array(cvt.length + 1);
                  cvtData.set(cvt.data);
                  cvt.data = cvtData;
                }

                return ttContext.hintsValid;
              }

              font = new _stream.Stream(new Uint8Array(font.getBytes()));
              var header, tables;

              if (isTrueTypeCollectionFile(font)) {
                var ttcData = readTrueTypeCollectionData(font, this.name);
                header = ttcData.header;
                tables = ttcData.tables;
              } else {
                header = readOpenTypeHeader(font);
                tables = readTables(font, header.numTables);
              }

              var cff, cffFile;
              var isTrueType = !tables["CFF "];

              if (!isTrueType) {
                var isComposite =
                  properties.composite &&
                  ((properties.cidToGidMap || []).length > 0 ||
                    !(properties.cMap instanceof _cmap.IdentityCMap));

                if (
                  (header.version === "OTTO" && !isComposite) ||
                  !tables["head"] ||
                  !tables["hhea"] ||
                  !tables["maxp"] ||
                  !tables["post"]
                ) {
                  cffFile = new _stream.Stream(tables["CFF "].data);
                  cff = new CFFFont(cffFile, properties);
                  adjustWidths(properties);
                  return this.convert(name, cff, properties);
                }

                delete tables["glyf"];
                delete tables["loca"];
                delete tables["fpgm"];
                delete tables["prep"];
                delete tables["cvt "];
                this.isOpenType = true;
              } else {
                if (!tables["loca"]) {
                  throw new _util.FormatError(
                    'Required "loca" table is not found'
                  );
                }

                if (!tables["glyf"]) {
                  (0, _util.warn)(
                    'Required "glyf" table is not found -- trying to recover.'
                  );
                  tables["glyf"] = {
                    tag: "glyf",
                    data: new Uint8Array(0)
                  };
                }

                this.isOpenType = false;
              }

              if (!tables["maxp"]) {
                throw new _util.FormatError(
                  'Required "maxp" table is not found'
                );
              }

              font.pos = (font.start || 0) + tables["maxp"].offset;
              var version = font.getInt32();
              var numGlyphs = font.getUint16();
              var numGlyphsOut = numGlyphs + 1;
              var dupFirstEntry = true;

              if (numGlyphsOut > 0xffff) {
                dupFirstEntry = false;
                numGlyphsOut = numGlyphs;
                (0, _util.warn)(
                  "Not enough space in glyfs to duplicate first glyph."
                );
              }

              var maxFunctionDefs = 0;
              var maxSizeOfInstructions = 0;

              if (version >= 0x00010000 && tables["maxp"].length >= 22) {
                font.pos += 8;
                var maxZones = font.getUint16();

                if (maxZones > 2) {
                  tables["maxp"].data[14] = 0;
                  tables["maxp"].data[15] = 2;
                }

                font.pos += 4;
                maxFunctionDefs = font.getUint16();
                font.pos += 4;
                maxSizeOfInstructions = font.getUint16();
              }

              tables["maxp"].data[4] = numGlyphsOut >> 8;
              tables["maxp"].data[5] = numGlyphsOut & 255;
              var hintsValid = sanitizeTTPrograms(
                tables["fpgm"],
                tables["prep"],
                tables["cvt "],
                maxFunctionDefs
              );

              if (!hintsValid) {
                delete tables["fpgm"];
                delete tables["prep"];
                delete tables["cvt "];
              }

              sanitizeMetrics(
                font,
                tables["hhea"],
                tables["hmtx"],
                numGlyphsOut
              );

              if (!tables["head"]) {
                throw new _util.FormatError(
                  'Required "head" table is not found'
                );
              }

              sanitizeHead(
                tables["head"],
                numGlyphs,
                isTrueType ? tables["loca"].length : 0
              );
              var missingGlyphs = Object.create(null);

              if (isTrueType) {
                var isGlyphLocationsLong = int16(
                  tables["head"].data[50],
                  tables["head"].data[51]
                );
                var glyphsInfo = sanitizeGlyphLocations(
                  tables["loca"],
                  tables["glyf"],
                  numGlyphs,
                  isGlyphLocationsLong,
                  hintsValid,
                  dupFirstEntry,
                  maxSizeOfInstructions
                );
                missingGlyphs = glyphsInfo.missingGlyphs;

                if (version >= 0x00010000 && tables["maxp"].length >= 22) {
                  tables["maxp"].data[26] =
                    glyphsInfo.maxSizeOfInstructions >> 8;
                  tables["maxp"].data[27] =
                    glyphsInfo.maxSizeOfInstructions & 255;
                }
              }

              if (!tables["hhea"]) {
                throw new _util.FormatError(
                  'Required "hhea" table is not found'
                );
              }

              if (
                tables["hhea"].data[10] === 0 &&
                tables["hhea"].data[11] === 0
              ) {
                tables["hhea"].data[10] = 0xff;
                tables["hhea"].data[11] = 0xff;
              }

              var metricsOverride = {
                unitsPerEm: int16(
                  tables["head"].data[18],
                  tables["head"].data[19]
                ),
                yMax: int16(tables["head"].data[42], tables["head"].data[43]),
                yMin: signedInt16(
                  tables["head"].data[38],
                  tables["head"].data[39]
                ),
                ascent: int16(tables["hhea"].data[4], tables["hhea"].data[5]),
                descent: signedInt16(
                  tables["hhea"].data[6],
                  tables["hhea"].data[7]
                )
              };
              this.ascent = metricsOverride.ascent / metricsOverride.unitsPerEm;
              this.descent =
                metricsOverride.descent / metricsOverride.unitsPerEm;

              if (tables["post"]) {
                readPostScriptTable(tables["post"], properties, numGlyphs);
              }

              tables["post"] = {
                tag: "post",
                data: createPostTable(properties)
              };
              var charCodeToGlyphId = [],
                charCode;

              function hasGlyph(glyphId) {
                return !missingGlyphs[glyphId];
              }

              if (properties.composite) {
                var cidToGidMap = properties.cidToGidMap || [];
                var isCidToGidMapEmpty = cidToGidMap.length === 0;
                properties.cMap.forEach(function(charCode, cid) {
                  if (cid > 0xffff) {
                    throw new _util.FormatError("Max size of CID is 65,535");
                  }

                  var glyphId = -1;

                  if (isCidToGidMapEmpty) {
                    glyphId = cid;
                  } else if (cidToGidMap[cid] !== undefined) {
                    glyphId = cidToGidMap[cid];
                  }

                  if (
                    glyphId >= 0 &&
                    glyphId < numGlyphs &&
                    hasGlyph(glyphId)
                  ) {
                    charCodeToGlyphId[charCode] = glyphId;
                  }
                });
              } else {
                var cmapTable = readCmapTable(
                  tables["cmap"],
                  font,
                  this.isSymbolicFont,
                  properties.hasEncoding
                );
                var cmapPlatformId = cmapTable.platformId;
                var cmapEncodingId = cmapTable.encodingId;
                var cmapMappings = cmapTable.mappings;
                var cmapMappingsLength = cmapMappings.length;

                if (
                  (properties.hasEncoding &&
                    ((cmapPlatformId === 3 && cmapEncodingId === 1) ||
                      (cmapPlatformId === 1 && cmapEncodingId === 0))) ||
                  (cmapPlatformId === -1 &&
                    cmapEncodingId === -1 &&
                    !!(0, _encodings.getEncoding)(properties.baseEncodingName))
                ) {
                  var baseEncoding = [];

                  if (
                    properties.baseEncodingName === "MacRomanEncoding" ||
                    properties.baseEncodingName === "WinAnsiEncoding"
                  ) {
                    baseEncoding = (0, _encodings.getEncoding)(
                      properties.baseEncodingName
                    );
                  }

                  var glyphsUnicodeMap = (0, _glyphlist.getGlyphsUnicode)();

                  for (charCode = 0; charCode < 256; charCode++) {
                    var glyphName, standardGlyphName;

                    if (this.differences && charCode in this.differences) {
                      glyphName = this.differences[charCode];
                    } else if (
                      charCode in baseEncoding &&
                      baseEncoding[charCode] !== ""
                    ) {
                      glyphName = baseEncoding[charCode];
                    } else {
                      glyphName = _encodings.StandardEncoding[charCode];
                    }

                    if (!glyphName) {
                      continue;
                    }

                    standardGlyphName = recoverGlyphName(
                      glyphName,
                      glyphsUnicodeMap
                    );
                    var unicodeOrCharCode;

                    if (cmapPlatformId === 3 && cmapEncodingId === 1) {
                      unicodeOrCharCode = glyphsUnicodeMap[standardGlyphName];
                    } else if (cmapPlatformId === 1 && cmapEncodingId === 0) {
                      unicodeOrCharCode = _encodings.MacRomanEncoding.indexOf(
                        standardGlyphName
                      );
                    }

                    var found = false;

                    for (var i = 0; i < cmapMappingsLength; ++i) {
                      if (cmapMappings[i].charCode !== unicodeOrCharCode) {
                        continue;
                      }

                      charCodeToGlyphId[charCode] = cmapMappings[i].glyphId;
                      found = true;
                      break;
                    }

                    if (!found && properties.glyphNames) {
                      var glyphId = properties.glyphNames.indexOf(glyphName);

                      if (glyphId === -1 && standardGlyphName !== glyphName) {
                        glyphId = properties.glyphNames.indexOf(
                          standardGlyphName
                        );
                      }

                      if (glyphId > 0 && hasGlyph(glyphId)) {
                        charCodeToGlyphId[charCode] = glyphId;
                      }
                    }
                  }
                } else if (cmapPlatformId === 0 && cmapEncodingId === 0) {
                  for (var _i2 = 0; _i2 < cmapMappingsLength; ++_i2) {
                    charCodeToGlyphId[cmapMappings[_i2].charCode] =
                      cmapMappings[_i2].glyphId;
                  }
                } else {
                  for (var _i3 = 0; _i3 < cmapMappingsLength; ++_i3) {
                    charCode = cmapMappings[_i3].charCode;

                    if (
                      cmapPlatformId === 3 &&
                      charCode >= 0xf000 &&
                      charCode <= 0xf0ff
                    ) {
                      charCode &= 0xff;
                    }

                    charCodeToGlyphId[charCode] = cmapMappings[_i3].glyphId;
                  }
                }
              }

              if (charCodeToGlyphId.length === 0) {
                charCodeToGlyphId[0] = 0;
              }

              var glyphZeroId = numGlyphsOut - 1;

              if (!dupFirstEntry) {
                glyphZeroId = 0;
              }

              var newMapping = adjustMapping(
                charCodeToGlyphId,
                hasGlyph,
                glyphZeroId
              );
              this.toFontChar = newMapping.toFontChar;
              tables["cmap"] = {
                tag: "cmap",
                data: createCmapTable(
                  newMapping.charCodeToGlyphId,
                  numGlyphsOut
                )
              };

              if (!tables["OS/2"] || !validateOS2Table(tables["OS/2"])) {
                tables["OS/2"] = {
                  tag: "OS/2",
                  data: createOS2Table(
                    properties,
                    newMapping.charCodeToGlyphId,
                    metricsOverride
                  )
                };
              }

              if (!isTrueType) {
                try {
                  cffFile = new _stream.Stream(tables["CFF "].data);
                  var parser = new _cff_parser.CFFParser(
                    cffFile,
                    properties,
                    SEAC_ANALYSIS_ENABLED
                  );
                  cff = parser.parse();
                  cff.duplicateFirstGlyph();
                  var compiler = new _cff_parser.CFFCompiler(cff);
                  tables["CFF "].data = compiler.compile();
                } catch (e) {
                  (0, _util.warn)(
                    "Failed to compile font " + properties.loadedName
                  );
                }
              }

              if (!tables["name"]) {
                tables["name"] = {
                  tag: "name",
                  data: createNameTable(this.name)
                };
              } else {
                var namePrototype = readNameTable(tables["name"]);
                tables["name"].data = createNameTable(name, namePrototype);
              }

              var builder = new OpenTypeFileBuilder(header.version);

              for (var tableTag in tables) {
                builder.addTable(tableTag, tables[tableTag].data);
              }

              return builder.toArray();
            },

}
