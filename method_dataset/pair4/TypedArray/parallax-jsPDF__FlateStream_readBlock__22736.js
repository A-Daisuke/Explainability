function __method_wrapper__() {
          FlateStream.prototype.readBlock = function FlateStream_readBlock() {
            var buffer, len;
            var str = this.str;
            var hdr = this.getBits(3);

            if (hdr & 1) {
              this.eof = true;
            }

            hdr >>= 1;

            if (hdr === 0) {
              var b;

              if ((b = str.getByte()) === -1) {
                throw new _util.FormatError("Bad block header in flate stream");
              }

              var blockLen = b;

              if ((b = str.getByte()) === -1) {
                throw new _util.FormatError("Bad block header in flate stream");
              }

              blockLen |= b << 8;

              if ((b = str.getByte()) === -1) {
                throw new _util.FormatError("Bad block header in flate stream");
              }

              var check = b;

              if ((b = str.getByte()) === -1) {
                throw new _util.FormatError("Bad block header in flate stream");
              }

              check |= b << 8;

              if (
                check !== (~blockLen & 0xffff) &&
                (blockLen !== 0 || check !== 0)
              ) {
                throw new _util.FormatError(
                  "Bad uncompressed block length in flate stream"
                );
              }

              this.codeBuf = 0;
              this.codeSize = 0;
              var bufferLength = this.bufferLength;
              buffer = this.ensureBuffer(bufferLength + blockLen);
              var end = bufferLength + blockLen;
              this.bufferLength = end;

              if (blockLen === 0) {
                if (str.peekByte() === -1) {
                  this.eof = true;
                }
              } else {
                for (var n = bufferLength; n < end; ++n) {
                  if ((b = str.getByte()) === -1) {
                    this.eof = true;
                    break;
                  }

                  buffer[n] = b;
                }
              }

              return;
            }

            var litCodeTable;
            var distCodeTable;

            if (hdr === 1) {
              litCodeTable = fixedLitCodeTab;
              distCodeTable = fixedDistCodeTab;
            } else if (hdr === 2) {
              var numLitCodes = this.getBits(5) + 257;
              var numDistCodes = this.getBits(5) + 1;
              var numCodeLenCodes = this.getBits(4) + 4;
              var codeLenCodeLengths = new Uint8Array(codeLenCodeMap.length);
              var i;

              for (i = 0; i < numCodeLenCodes; ++i) {
                codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3);
              }

              var codeLenCodeTab = this.generateHuffmanTable(
                codeLenCodeLengths
              );
              len = 0;
              i = 0;
              var codes = numLitCodes + numDistCodes;
              var codeLengths = new Uint8Array(codes);
              var bitsLength, bitsOffset, what;

              while (i < codes) {
                var code = this.getCode(codeLenCodeTab);

                if (code === 16) {
                  bitsLength = 2;
                  bitsOffset = 3;
                  what = len;
                } else if (code === 17) {
                  bitsLength = 3;
                  bitsOffset = 3;
                  what = len = 0;
                } else if (code === 18) {
                  bitsLength = 7;
                  bitsOffset = 11;
                  what = len = 0;
                } else {
                  codeLengths[i++] = len = code;
                  continue;
                }

                var repeatLength = this.getBits(bitsLength) + bitsOffset;

                while (repeatLength-- > 0) {
                  codeLengths[i++] = what;
                }
              }

              litCodeTable = this.generateHuffmanTable(
                codeLengths.subarray(0, numLitCodes)
              );
              distCodeTable = this.generateHuffmanTable(
                codeLengths.subarray(numLitCodes, codes)
              );
            } else {
              throw new _util.FormatError("Unknown block type in flate stream");
            }

            buffer = this.buffer;
            var limit = buffer ? buffer.length : 0;
            var pos = this.bufferLength;

            while (true) {
              var code1 = this.getCode(litCodeTable);

              if (code1 < 256) {
                if (pos + 1 >= limit) {
                  buffer = this.ensureBuffer(pos + 1);
                  limit = buffer.length;
                }

                buffer[pos++] = code1;
                continue;
              }

              if (code1 === 256) {
                this.bufferLength = pos;
                return;
              }

              code1 -= 257;
              code1 = lengthDecode[code1];
              var code2 = code1 >> 16;

              if (code2 > 0) {
                code2 = this.getBits(code2);
              }

              len = (code1 & 0xffff) + code2;
              code1 = this.getCode(distCodeTable);
              code1 = distDecode[code1];
              code2 = code1 >> 16;

              if (code2 > 0) {
                code2 = this.getBits(code2);
              }

              var dist = (code1 & 0xffff) + code2;

              if (pos + len >= limit) {
                buffer = this.ensureBuffer(pos + len);
                limit = buffer.length;
              }

              for (var k = 0; k < len; ++k, ++pos) {
                buffer[pos] = buffer[pos - dist];
              }
            }
          };

}
