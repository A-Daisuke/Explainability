          function JpegStream(stream, maybeLength, dict, params) {
            var ch;

            while ((ch = stream.getByte()) !== -1) {
              if (ch === 0xff) {
                stream.skip(-1);
                break;
              }
            }

            this.stream = stream;
            this.maybeLength = maybeLength;
            this.dict = dict;
            this.params = params;

            _stream.DecodeStream.call(this, maybeLength);
          }
