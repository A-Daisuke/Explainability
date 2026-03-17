function __method_wrapper__() {
                value: function makeStream(dict, cipherTransform) {
                  var lexer = this.lexer;
                  var stream = lexer.stream;
                  lexer.skipToNextLine();
                  var startPos = stream.pos - 1;
                  var length = dict.get("Length");

                  if (!Number.isInteger(length)) {
                    (0, _util.info)(
                      'Bad length "'.concat(length, '" in stream')
                    );
                    length = 0;
                  }

                  stream.pos = startPos + length;
                  lexer.nextChar();

                  if (
                    this.tryShift() &&
                    (0, _primitives.isCmd)(this.buf2, "endstream")
                  ) {
                    this.shift();
                  } else {
                    var ENDSTREAM_SIGNATURE = new Uint8Array([
                      0x65,
                      0x6e,
                      0x64,
                      0x73,
                      0x74,
                      0x72,
                      0x65,
                      0x61,
                      0x6d
                    ]);

                    var actualLength = this._findStreamLength(
                      startPos,
                      ENDSTREAM_SIGNATURE
                    );

                    if (actualLength < 0) {
                      var MAX_TRUNCATION = 1;

                      for (var i = 1; i <= MAX_TRUNCATION; i++) {
                        var end = ENDSTREAM_SIGNATURE.length - i;
                        var TRUNCATED_SIGNATURE = ENDSTREAM_SIGNATURE.slice(
                          0,
                          end
                        );

                        var maybeLength = this._findStreamLength(
                          startPos,
                          TRUNCATED_SIGNATURE
                        );

                        if (maybeLength >= 0) {
                          var lastByte = stream.peekBytes(end + 1)[end];

                          if (!(0, _util.isSpace)(lastByte)) {
                            break;
                          }

                          (0, _util.info)(
                            'Found "'.concat(
                              (0, _util.bytesToString)(TRUNCATED_SIGNATURE),
                              '" when '
                            ) + "searching for endstream command."
                          );
                          actualLength = maybeLength;
                          break;
                        }
                      }

                      if (actualLength < 0) {
                        throw new _util.FormatError(
                          "Missing endstream command."
                        );
                      }
                    }

                    length = actualLength;
                    lexer.nextChar();
                    this.shift();
                    this.shift();
                  }

                  this.shift();
                  stream = stream.makeSubStream(startPos, length, dict);

                  if (cipherTransform) {
                    stream = cipherTransform.createStream(stream, length);
                  }

                  stream = this.filter(stream, dict, length);
                  stream.dict = dict;
                  return stream;
                }

}
