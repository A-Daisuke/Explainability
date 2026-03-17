function __method_wrapper__() {
            Transform.prototype.iterate = function Transform_iterate(
              ll,
              hl_lh_hh,
              u0,
              v0
            ) {
              var llWidth = ll.width,
                llHeight = ll.height,
                llItems = ll.items;
              var width = hl_lh_hh.width;
              var height = hl_lh_hh.height;
              var items = hl_lh_hh.items;
              var i, j, k, l, u, v;

              for (k = 0, i = 0; i < llHeight; i++) {
                l = i * 2 * width;

                for (j = 0; j < llWidth; j++, k++, l += 2) {
                  items[l] = llItems[k];
                }
              }

              llItems = ll.items = null;
              var bufferPadding = 4;
              var rowBuffer = new Float32Array(width + 2 * bufferPadding);

              if (width === 1) {
                if ((u0 & 1) !== 0) {
                  for (v = 0, k = 0; v < height; v++, k += width) {
                    items[k] *= 0.5;
                  }
                }
              } else {
                for (v = 0, k = 0; v < height; v++, k += width) {
                  rowBuffer.set(items.subarray(k, k + width), bufferPadding);
                  this.extend(rowBuffer, bufferPadding, width);
                  this.filter(rowBuffer, bufferPadding, width);
                  items.set(
                    rowBuffer.subarray(bufferPadding, bufferPadding + width),
                    k
                  );
                }
              }

              var numBuffers = 16;
              var colBuffers = [];

              for (i = 0; i < numBuffers; i++) {
                colBuffers.push(new Float32Array(height + 2 * bufferPadding));
              }

              var b,
                currentBuffer = 0;
              ll = bufferPadding + height;

              if (height === 1) {
                if ((v0 & 1) !== 0) {
                  for (u = 0; u < width; u++) {
                    items[u] *= 0.5;
                  }
                }
              } else {
                for (u = 0; u < width; u++) {
                  if (currentBuffer === 0) {
                    numBuffers = Math.min(width - u, numBuffers);

                    for (k = u, l = bufferPadding; l < ll; k += width, l++) {
                      for (b = 0; b < numBuffers; b++) {
                        colBuffers[b][l] = items[k + b];
                      }
                    }

                    currentBuffer = numBuffers;
                  }

                  currentBuffer--;
                  var buffer = colBuffers[currentBuffer];
                  this.extend(buffer, bufferPadding, height);
                  this.filter(buffer, bufferPadding, height);

                  if (currentBuffer === 0) {
                    k = u - numBuffers + 1;

                    for (l = bufferPadding; l < ll; k += width, l++) {
                      for (b = 0; b < numBuffers; b++) {
                        items[k + b] = colBuffers[b][l];
                      }
                    }
                  }
                }
              }

              return {
                width: width,
                height: height,
                items: items
              };
            };

}
