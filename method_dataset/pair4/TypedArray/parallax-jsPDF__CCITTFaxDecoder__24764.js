          function CCITTFaxDecoder(source) {
            var options =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};

            if (!source || typeof source.next !== "function") {
              throw new Error('CCITTFaxDecoder - invalid "source" parameter.');
            }

            this.source = source;
            this.eof = false;
            this.encoding = options["K"] || 0;
            this.eoline = options["EndOfLine"] || false;
            this.byteAlign = options["EncodedByteAlign"] || false;
            this.columns = options["Columns"] || 1728;
            this.rows = options["Rows"] || 0;
            var eoblock = options["EndOfBlock"];

            if (eoblock === null || eoblock === undefined) {
              eoblock = true;
            }

            this.eoblock = eoblock;
            this.black = options["BlackIs1"] || false;
            this.codingLine = new Uint32Array(this.columns + 1);
            this.refLine = new Uint32Array(this.columns + 2);
            this.codingLine[0] = this.columns;
            this.codingPos = 0;
            this.row = 0;
            this.nextLine2D = this.encoding < 0;
            this.inputBits = 0;
            this.inputBuf = 0;
            this.outputBits = 0;
            this.rowsDone = false;
            var code1;

            while ((code1 = this._lookBits(12)) === 0) {
              this._eatBits(1);
            }

            if (code1 === 1) {
              this._eatBits(12);
            }

            if (this.encoding > 0) {
              this.nextLine2D = !this._lookBits(1);

              this._eatBits(1);
            }
          }
