function __method_wrapper__() {
          JpxStream.prototype.readBlock = function() {
            if (this.eof) {
              return;
            }

            var jpxImage = new _jpx.JpxImage();
            jpxImage.parse(this.bytes);
            var width = jpxImage.width;
            var height = jpxImage.height;
            var componentsCount = jpxImage.componentsCount;
            var tileCount = jpxImage.tiles.length;

            if (tileCount === 1) {
              this.buffer = jpxImage.tiles[0].items;
            } else {
              var data = new Uint8ClampedArray(
                width * height * componentsCount
              );

              for (var k = 0; k < tileCount; k++) {
                var tileComponents = jpxImage.tiles[k];
                var tileWidth = tileComponents.width;
                var tileHeight = tileComponents.height;
                var tileLeft = tileComponents.left;
                var tileTop = tileComponents.top;
                var src = tileComponents.items;
                var srcPosition = 0;
                var dataPosition =
                  (width * tileTop + tileLeft) * componentsCount;
                var imgRowSize = width * componentsCount;
                var tileRowSize = tileWidth * componentsCount;

                for (var j = 0; j < tileHeight; j++) {
                  var rowBytes = src.subarray(
                    srcPosition,
                    srcPosition + tileRowSize
                  );
                  data.set(rowBytes, dataPosition);
                  srcPosition += tileRowSize;
                  dataPosition += imgRowSize;
                }
              }

              this.buffer = data;
            }

            this.bufferLength = this.buffer.length;
            this.eof = true;
          };

}
