        function resizeRgbImage(src, dest, w1, h1, w2, h2, alpha01) {
          var COMPONENTS = 3;
          alpha01 = alpha01 !== 1 ? 0 : alpha01;
          var xRatio = w1 / w2;
          var yRatio = h1 / h2;
          var newIndex = 0,
            oldIndex;
          var xScaled = new Uint16Array(w2);
          var w1Scanline = w1 * COMPONENTS;

          for (var i = 0; i < w2; i++) {
            xScaled[i] = Math.floor(i * xRatio) * COMPONENTS;
          }

          for (var _i = 0; _i < h2; _i++) {
            var py = Math.floor(_i * yRatio) * w1Scanline;

            for (var j = 0; j < w2; j++) {
              oldIndex = py + xScaled[j];
              dest[newIndex++] = src[oldIndex++];
              dest[newIndex++] = src[oldIndex++];
              dest[newIndex++] = src[oldIndex++];
              newIndex += alpha01;
            }
          }
        }
