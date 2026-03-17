          function CCITTFaxStream(str, maybeLength, params) {
            this.str = str;
            this.dict = str.dict;

            if (!(0, _primitives.isDict)(params)) {
              params = _primitives.Dict.empty;
            }

            var source = {
              next: function next() {
                return str.getByte();
              }
            };
            this.ccittFaxDecoder = new _ccitt.CCITTFaxDecoder(source, {
              K: params.get("K"),
              EndOfLine: params.get("EndOfLine"),
              EncodedByteAlign: params.get("EncodedByteAlign"),
              Columns: params.get("Columns"),
              Rows: params.get("Rows"),
              EndOfBlock: params.get("EndOfBlock"),
              BlackIs1: params.get("BlackIs1")
            });

            _stream.DecodeStream.call(this, maybeLength);
          }
