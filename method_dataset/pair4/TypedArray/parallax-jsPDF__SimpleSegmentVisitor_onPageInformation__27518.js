const __obj__ = {
            onPageInformation: function SimpleSegmentVisitor_onPageInformation(
              info
            ) {
              this.currentPageInfo = info;
              var rowSize = (info.width + 7) >> 3;
              var buffer = new Uint8ClampedArray(rowSize * info.height);

              if (info.defaultPixelValue) {
                for (var i = 0, ii = buffer.length; i < ii; i++) {
                  buffer[i] = 0xff;
                }
              }

              this.buffer = buffer;
            },

};
