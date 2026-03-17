          function PredictorStream(str, maybeLength, params) {
            if (!(0, _primitives.isDict)(params)) {
              return str;
            }

            var predictor = (this.predictor = params.get("Predictor") || 1);

            if (predictor <= 1) {
              return str;
            }

            if (predictor !== 2 && (predictor < 10 || predictor > 15)) {
              throw new _util.FormatError(
                "Unsupported predictor: ".concat(predictor)
              );
            }

            if (predictor === 2) {
              this.readBlock = this.readBlockTiff;
            } else {
              this.readBlock = this.readBlockPng;
            }

            this.str = str;
            this.dict = str.dict;
            var colors = (this.colors = params.get("Colors") || 1);
            var bits = (this.bits = params.get("BitsPerComponent") || 8);
            var columns = (this.columns = params.get("Columns") || 1);
            this.pixBytes = (colors * bits + 7) >> 3;
            this.rowBytes = (columns * colors * bits + 7) >> 3;
            DecodeStream.call(this, maybeLength);
            return this;
          }
