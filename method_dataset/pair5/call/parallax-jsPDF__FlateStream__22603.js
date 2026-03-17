          function FlateStream(str, maybeLength) {
            this.str = str;
            this.dict = str.dict;
            var cmf = str.getByte();
            var flg = str.getByte();

            if (cmf === -1 || flg === -1) {
              throw new _util.FormatError(
                "Invalid header in flate stream: ".concat(cmf, ", ").concat(flg)
              );
            }

            if ((cmf & 0x0f) !== 0x08) {
              throw new _util.FormatError(
                "Unknown compression method in flate stream: "
                  .concat(cmf, ", ")
                  .concat(flg)
              );
            }

            if (((cmf << 8) + flg) % 31 !== 0) {
              throw new _util.FormatError(
                "Bad FCHECK in flate stream: ".concat(cmf, ", ").concat(flg)
              );
            }

            if (flg & 0x20) {
              throw new _util.FormatError(
                "FDICT bit set in flate stream: ".concat(cmf, ", ").concat(flg)
              );
            }

            this.codeSize = 0;
            this.codeBuf = 0;
            DecodeStream.call(this, maybeLength);
          }
