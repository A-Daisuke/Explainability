function __method_wrapper__() {
                        img.onload = function() {
                          var width = img.width,
                            height = img.height;
                          var size = width * height;
                          var rgbaLength = size * 4;
                          var buf = new Uint8ClampedArray(size * components);
                          var tmpCanvas = document.createElement("canvas");
                          tmpCanvas.width = width;
                          tmpCanvas.height = height;
                          var tmpCtx = tmpCanvas.getContext("2d");
                          tmpCtx.drawImage(img, 0, 0);
                          var data = tmpCtx.getImageData(0, 0, width, height)
                            .data;

                          if (components === 3) {
                            for (
                              var i = 0, j = 0;
                              i < rgbaLength;
                              i += 4, j += 3
                            ) {
                              buf[j] = data[i];
                              buf[j + 1] = data[i + 1];
                              buf[j + 2] = data[i + 2];
                            }
                          } else if (components === 1) {
                            for (
                              var _i2 = 0, _j = 0;
                              _i2 < rgbaLength;
                              _i2 += 4, _j++
                            ) {
                              buf[_j] = data[_i2];
                            }
                          }

                          resolve({
                            data: buf,
                            width: width,
                            height: height
                          });
                          (0, _display_utils.releaseImageResources)(img);
                          tmpCanvas.width = 0;
                          tmpCanvas.height = 0;
                          tmpCanvas = null;
                          tmpCtx = null;
                        };

}
