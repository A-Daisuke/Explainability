function __method_wrapper__() {
            fillOpacity: function fillOpacity(
              rgbaBuf,
              width,
              height,
              actualHeight,
              image
            ) {
              var smask = this.smask;
              var mask = this.mask;
              var alphaBuf, sw, sh, i, ii, j;

              if (smask) {
                sw = smask.width;
                sh = smask.height;
                alphaBuf = new Uint8ClampedArray(sw * sh);
                smask.fillGrayBuffer(alphaBuf);

                if (sw !== width || sh !== height) {
                  alphaBuf = resizeImageMask(
                    alphaBuf,
                    smask.bpc,
                    sw,
                    sh,
                    width,
                    height
                  );
                }
              } else if (mask) {
                if (mask instanceof PDFImage) {
                  sw = mask.width;
                  sh = mask.height;
                  alphaBuf = new Uint8ClampedArray(sw * sh);
                  mask.numComps = 1;
                  mask.fillGrayBuffer(alphaBuf);

                  for (i = 0, ii = sw * sh; i < ii; ++i) {
                    alphaBuf[i] = 255 - alphaBuf[i];
                  }

                  if (sw !== width || sh !== height) {
                    alphaBuf = resizeImageMask(
                      alphaBuf,
                      mask.bpc,
                      sw,
                      sh,
                      width,
                      height
                    );
                  }
                } else if (Array.isArray(mask)) {
                  alphaBuf = new Uint8ClampedArray(width * height);
                  var numComps = this.numComps;

                  for (i = 0, ii = width * height; i < ii; ++i) {
                    var opacity = 0;
                    var imageOffset = i * numComps;

                    for (j = 0; j < numComps; ++j) {
                      var color = image[imageOffset + j];
                      var maskOffset = j * 2;

                      if (
                        color < mask[maskOffset] ||
                        color > mask[maskOffset + 1]
                      ) {
                        opacity = 255;
                        break;
                      }
                    }

                    alphaBuf[i] = opacity;
                  }
                } else {
                  throw new _util.FormatError("Unknown mask format.");
                }
              }

              if (alphaBuf) {
                for (
                  i = 0, j = 3, ii = width * actualHeight;
                  i < ii;
                  ++i, j += 4
                ) {
                  rgbaBuf[j] = alphaBuf[i];
                }
              } else {
                for (
                  i = 0, j = 3, ii = width * actualHeight;
                  i < ii;
                  ++i, j += 4
                ) {
                  rgbaBuf[j] = 255;
                }
              }
            },

}
