function __method_wrapper__() {
            return new Promise(function(resolve, reject) {
              var stream = new BinaryCMapStream(data);
              var header = stream.readByte();
              cMap.vertical = !!(header & 1);
              var useCMap = null;
              var start = new Uint8Array(MAX_NUM_SIZE);
              var end = new Uint8Array(MAX_NUM_SIZE);
              var char = new Uint8Array(MAX_NUM_SIZE);
              var charCode = new Uint8Array(MAX_NUM_SIZE);
              var tmp = new Uint8Array(MAX_NUM_SIZE);
              var code;
              var b;

              while ((b = stream.readByte()) >= 0) {
                var type = b >> 5;

                if (type === 7) {
                  switch (b & 0x1f) {
                    case 0:
                      stream.readString();
                      break;

                    case 1:
                      useCMap = stream.readString();
                      break;
                  }

                  continue;
                }

                var sequence = !!(b & 0x10);
                var dataSize = b & 15;

                if (dataSize + 1 > MAX_NUM_SIZE) {
                  throw new Error("processBinaryCMap: Invalid dataSize.");
                }

                var ucs2DataSize = 1;
                var subitemsCount = stream.readNumber();
                var i;

                switch (type) {
                  case 0:
                    stream.readHex(start, dataSize);
                    stream.readHexNumber(end, dataSize);
                    addHex(end, start, dataSize);
                    cMap.addCodespaceRange(
                      dataSize + 1,
                      hexToInt(start, dataSize),
                      hexToInt(end, dataSize)
                    );

                    for (i = 1; i < subitemsCount; i++) {
                      incHex(end, dataSize);
                      stream.readHexNumber(start, dataSize);
                      addHex(start, end, dataSize);
                      stream.readHexNumber(end, dataSize);
                      addHex(end, start, dataSize);
                      cMap.addCodespaceRange(
                        dataSize + 1,
                        hexToInt(start, dataSize),
                        hexToInt(end, dataSize)
                      );
                    }

                    break;

                  case 1:
                    stream.readHex(start, dataSize);
                    stream.readHexNumber(end, dataSize);
                    addHex(end, start, dataSize);
                    stream.readNumber();

                    for (i = 1; i < subitemsCount; i++) {
                      incHex(end, dataSize);
                      stream.readHexNumber(start, dataSize);
                      addHex(start, end, dataSize);
                      stream.readHexNumber(end, dataSize);
                      addHex(end, start, dataSize);
                      stream.readNumber();
                    }

                    break;

                  case 2:
                    stream.readHex(char, dataSize);
                    code = stream.readNumber();
                    cMap.mapOne(hexToInt(char, dataSize), code);

                    for (i = 1; i < subitemsCount; i++) {
                      incHex(char, dataSize);

                      if (!sequence) {
                        stream.readHexNumber(tmp, dataSize);
                        addHex(char, tmp, dataSize);
                      }

                      code = stream.readSigned() + (code + 1);
                      cMap.mapOne(hexToInt(char, dataSize), code);
                    }

                    break;

                  case 3:
                    stream.readHex(start, dataSize);
                    stream.readHexNumber(end, dataSize);
                    addHex(end, start, dataSize);
                    code = stream.readNumber();
                    cMap.mapCidRange(
                      hexToInt(start, dataSize),
                      hexToInt(end, dataSize),
                      code
                    );

                    for (i = 1; i < subitemsCount; i++) {
                      incHex(end, dataSize);

                      if (!sequence) {
                        stream.readHexNumber(start, dataSize);
                        addHex(start, end, dataSize);
                      } else {
                        start.set(end);
                      }

                      stream.readHexNumber(end, dataSize);
                      addHex(end, start, dataSize);
                      code = stream.readNumber();
                      cMap.mapCidRange(
                        hexToInt(start, dataSize),
                        hexToInt(end, dataSize),
                        code
                      );
                    }

                    break;

                  case 4:
                    stream.readHex(char, ucs2DataSize);
                    stream.readHex(charCode, dataSize);
                    cMap.mapOne(
                      hexToInt(char, ucs2DataSize),
                      hexToStr(charCode, dataSize)
                    );

                    for (i = 1; i < subitemsCount; i++) {
                      incHex(char, ucs2DataSize);

                      if (!sequence) {
                        stream.readHexNumber(tmp, ucs2DataSize);
                        addHex(char, tmp, ucs2DataSize);
                      }

                      incHex(charCode, dataSize);
                      stream.readHexSigned(tmp, dataSize);
                      addHex(charCode, tmp, dataSize);
                      cMap.mapOne(
                        hexToInt(char, ucs2DataSize),
                        hexToStr(charCode, dataSize)
                      );
                    }

                    break;

                  case 5:
                    stream.readHex(start, ucs2DataSize);
                    stream.readHexNumber(end, ucs2DataSize);
                    addHex(end, start, ucs2DataSize);
                    stream.readHex(charCode, dataSize);
                    cMap.mapBfRange(
                      hexToInt(start, ucs2DataSize),
                      hexToInt(end, ucs2DataSize),
                      hexToStr(charCode, dataSize)
                    );

                    for (i = 1; i < subitemsCount; i++) {
                      incHex(end, ucs2DataSize);

                      if (!sequence) {
                        stream.readHexNumber(start, ucs2DataSize);
                        addHex(start, end, ucs2DataSize);
                      } else {
                        start.set(end);
                      }

                      stream.readHexNumber(end, ucs2DataSize);
                      addHex(end, start, ucs2DataSize);
                      stream.readHex(charCode, dataSize);
                      cMap.mapBfRange(
                        hexToInt(start, ucs2DataSize),
                        hexToInt(end, ucs2DataSize),
                        hexToStr(charCode, dataSize)
                      );
                    }

                    break;

                  default:
                    reject(
                      new Error("processBinaryCMap: Unknown type: " + type)
                    );
                    return;
                }
              }

              if (useCMap) {
                resolve(extend(useCMap));
                return;
              }

              resolve(cMap);
            });

}
