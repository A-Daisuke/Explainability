            function BitModel(width, height, subband, zeroBitPlanes, mb) {
              this.width = width;
              this.height = height;
              this.contextLabelTable =
                subband === "HH"
                  ? HHContextLabel
                  : subband === "HL"
                  ? HLContextLabel
                  : LLAndLHContextsLabel;
              var coefficientCount = width * height;
              this.neighborsSignificance = new Uint8Array(coefficientCount);
              this.coefficentsSign = new Uint8Array(coefficientCount);
              this.coefficentsMagnitude =
                mb > 14
                  ? new Uint32Array(coefficientCount)
                  : mb > 6
                  ? new Uint16Array(coefficientCount)
                  : new Uint8Array(coefficientCount);
              this.processingFlags = new Uint8Array(coefficientCount);
              var bitsDecoded = new Uint8Array(coefficientCount);

              if (zeroBitPlanes !== 0) {
                for (var i = 0; i < coefficientCount; i++) {
                  bitsDecoded[i] = zeroBitPlanes;
                }
              }

              this.bitsDecoded = bitsDecoded;
              this.reset();
            }
