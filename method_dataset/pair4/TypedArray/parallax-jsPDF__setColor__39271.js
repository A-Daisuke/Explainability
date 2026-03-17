function __method_wrapper__() {
                value: function setColor(color) {
                  var rgbColor = new Uint8ClampedArray(3);

                  if (!Array.isArray(color)) {
                    this.color = rgbColor;
                    return;
                  }

                  switch (color.length) {
                    case 0:
                      this.color = null;
                      break;

                    case 1:
                      _colorspace.ColorSpace.singletons.gray.getRgbItem(
                        color,
                        0,
                        rgbColor,
                        0
                      );

                      this.color = rgbColor;
                      break;

                    case 3:
                      _colorspace.ColorSpace.singletons.rgb.getRgbItem(
                        color,
                        0,
                        rgbColor,
                        0
                      );

                      this.color = rgbColor;
                      break;

                    case 4:
                      _colorspace.ColorSpace.singletons.cmyk.getRgbItem(
                        color,
                        0,
                        rgbColor,
                        0
                      );

                      this.color = rgbColor;
                      break;

                    default:
                      this.color = rgbColor;
                      break;
                  }
                }

}
