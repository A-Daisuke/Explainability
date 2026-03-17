function __method_wrapper__() {
            indexObjects: function XRef_indexObjects() {
              var TAB = 0x9,
                LF = 0xa,
                CR = 0xd,
                SPACE = 0x20;
              var PERCENT = 0x25,
                LT = 0x3c;

              function readToken(data, offset) {
                var token = "",
                  ch = data[offset];

                while (ch !== LF && ch !== CR && ch !== LT) {
                  if (++offset >= data.length) {
                    break;
                  }

                  token += String.fromCharCode(ch);
                  ch = data[offset];
                }

                return token;
              }

              function skipUntil(data, offset, what) {
                var length = what.length,
                  dataLength = data.length;
                var skipped = 0;

                while (offset < dataLength) {
                  var i = 0;

                  while (i < length && data[offset + i] === what[i]) {
                    ++i;
                  }

                  if (i >= length) {
                    break;
                  }

                  offset++;
                  skipped++;
                }

                return skipped;
              }

              var objRegExp = /^(\d+)\s+(\d+)\s+obj\b/;
              var endobjRegExp = /\bendobj[\b\s]$/;
              var nestedObjRegExp = /\s+(\d+\s+\d+\s+obj[\b\s<])$/;
              var CHECK_CONTENT_LENGTH = 25;
              var trailerBytes = new Uint8Array([
                116,
                114,
                97,
                105,
                108,
                101,
                114
              ]);
              var startxrefBytes = new Uint8Array([
                115,
                116,
                97,
                114,
                116,
                120,
                114,
                101,
                102
              ]);
              var objBytes = new Uint8Array([111, 98, 106]);
              var xrefBytes = new Uint8Array([47, 88, 82, 101, 102]);
              this.entries.length = 0;
              var stream = this.stream;
              stream.pos = 0;
              var buffer = stream.getBytes();
              var position = stream.start,
                length = buffer.length;
              var trailers = [],
                xrefStms = [];

              while (position < length) {
                var ch = buffer[position];

                if (ch === TAB || ch === LF || ch === CR || ch === SPACE) {
                  ++position;
                  continue;
                }

                if (ch === PERCENT) {
                  do {
                    ++position;

                    if (position >= length) {
                      break;
                    }

                    ch = buffer[position];
                  } while (ch !== LF && ch !== CR);

                  continue;
                }

                var token = readToken(buffer, position);
                var m;

                if (
                  token.startsWith("xref") &&
                  (token.length === 4 || /\s/.test(token[4]))
                ) {
                  position += skipUntil(buffer, position, trailerBytes);
                  trailers.push(position);
                  position += skipUntil(buffer, position, startxrefBytes);
                } else if ((m = objRegExp.exec(token))) {
                  var num = m[1] | 0,
                    gen = m[2] | 0;

                  if (typeof this.entries[num] === "undefined") {
                    this.entries[num] = {
                      offset: position - stream.start,
                      gen: gen,
                      uncompressed: true
                    };
                  }

                  var contentLength = void 0,
                    startPos = position + token.length;

                  while (startPos < buffer.length) {
                    var endPos =
                      startPos + skipUntil(buffer, startPos, objBytes) + 4;
                    contentLength = endPos - position;
                    var checkPos = Math.max(
                      endPos - CHECK_CONTENT_LENGTH,
                      startPos
                    );
                    var tokenStr = (0, _util.bytesToString)(
                      buffer.subarray(checkPos, endPos)
                    );

                    if (endobjRegExp.test(tokenStr)) {
                      break;
                    } else {
                      var objToken = nestedObjRegExp.exec(tokenStr);

                      if (objToken && objToken[1]) {
                        (0, _util.warn)(
                          'indexObjects: Found new "obj" inside of another "obj", ' +
                            'caused by missing "endobj" -- trying to recover.'
                        );
                        contentLength -= objToken[1].length;
                        break;
                      }
                    }

                    startPos = endPos;
                  }

                  var content = buffer.subarray(
                    position,
                    position + contentLength
                  );
                  var xrefTagOffset = skipUntil(content, 0, xrefBytes);

                  if (
                    xrefTagOffset < contentLength &&
                    content[xrefTagOffset + 5] < 64
                  ) {
                    xrefStms.push(position - stream.start);
                    this.xrefstms[position - stream.start] = 1;
                  }

                  position += contentLength;
                } else if (
                  token.startsWith("trailer") &&
                  (token.length === 7 || /\s/.test(token[7]))
                ) {
                  trailers.push(position);
                  position += skipUntil(buffer, position, startxrefBytes);
                } else {
                  position += token.length + 1;
                }
              }

              var i, ii;

              for (i = 0, ii = xrefStms.length; i < ii; ++i) {
                this.startXRefQueue.push(xrefStms[i]);
                this.readXRef(true);
              }

              var trailerDict;

              for (i = 0, ii = trailers.length; i < ii; ++i) {
                stream.pos = trailers[i];
                var parser = new _parser.Parser(
                  new _parser.Lexer(stream),
                  true,
                  this,
                  true
                );
                var obj = parser.getObj();

                if (!(0, _primitives.isCmd)(obj, "trailer")) {
                  continue;
                }

                var dict = parser.getObj();

                if (!(0, _primitives.isDict)(dict)) {
                  continue;
                }

                var rootDict = void 0;

                try {
                  rootDict = dict.get("Root");
                } catch (ex) {
                  if (ex instanceof _core_utils.MissingDataException) {
                    throw ex;
                  }

                  continue;
                }

                if (
                  !(0, _primitives.isDict)(rootDict) ||
                  !rootDict.has("Pages")
                ) {
                  continue;
                }

                if (dict.has("ID")) {
                  return dict;
                }

                trailerDict = dict;
              }

              if (trailerDict) {
                return trailerDict;
              }

              throw new _util.InvalidPDFException("Invalid PDF structure");
            },

}
