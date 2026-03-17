const __obj__ = {
                  value: function fillRgb(
                    dest,
                    originalWidth,
                    originalHeight,
                    width,
                    height,
                    actualHeight,
                    bpc,
                    comps,
                    alpha01
                  ) {
                    var count = originalWidth * originalHeight;
                    var rgbBuf = null;
                    var numComponentColors = 1 << bpc;
                    var needsResizing =
                      originalHeight !== height || originalWidth !== width;

                    if (this.isPassthrough(bpc)) {
                      rgbBuf = comps;
                    } else if (
                      this.numComps === 1 &&
                      count > numComponentColors &&
                      this.name !== "DeviceGray" &&
                      this.name !== "DeviceRGB"
                    ) {
                      var allColors =
                        bpc <= 8
                          ? new Uint8Array(numComponentColors)
                          : new Uint16Array(numComponentColors);

                      for (var i = 0; i < numComponentColors; i++) {
                        allColors[i] = i;
                      }

                      var colorMap = new Uint8ClampedArray(
                        numComponentColors * 3
                      );
                      this.getRgbBuffer(
                        allColors,
                        0,
                        numComponentColors,
                        colorMap,
                        0,
                        bpc,
                        0
                      );

                      if (!needsResizing) {
                        var destPos = 0;

                        for (var _i2 = 0; _i2 < count; ++_i2) {
                          var key = comps[_i2] * 3;
                          dest[destPos++] = colorMap[key];
                          dest[destPos++] = colorMap[key + 1];
                          dest[destPos++] = colorMap[key + 2];
                          destPos += alpha01;
                        }
                      } else {
                        rgbBuf = new Uint8Array(count * 3);
                        var rgbPos = 0;

                        for (var _i3 = 0; _i3 < count; ++_i3) {
                          var _key = comps[_i3] * 3;

                          rgbBuf[rgbPos++] = colorMap[_key];
                          rgbBuf[rgbPos++] = colorMap[_key + 1];
                          rgbBuf[rgbPos++] = colorMap[_key + 2];
                        }
                      }
                    } else {
                      if (!needsResizing) {
                        this.getRgbBuffer(
                          comps,
                          0,
                          width * actualHeight,
                          dest,
                          0,
                          bpc,
                          alpha01
                        );
                      } else {
                        rgbBuf = new Uint8ClampedArray(count * 3);
                        this.getRgbBuffer(comps, 0, count, rgbBuf, 0, bpc, 0);
                      }
                    }

                    if (rgbBuf) {
                      if (needsResizing) {
                        resizeRgbImage(
                          rgbBuf,
                          dest,
                          originalWidth,
                          originalHeight,
                          width,
                          height,
                          alpha01
                        );
                      } else {
                        var _destPos = 0,
                          _rgbPos = 0;

                        for (
                          var _i4 = 0, ii = width * actualHeight;
                          _i4 < ii;
                          _i4++
                        ) {
                          dest[_destPos++] = rgbBuf[_rgbPos++];
                          dest[_destPos++] = rgbBuf[_rgbPos++];
                          dest[_destPos++] = rgbBuf[_rgbPos++];
                          _destPos += alpha01;
                        }
                      }
                    }
                  }

};
